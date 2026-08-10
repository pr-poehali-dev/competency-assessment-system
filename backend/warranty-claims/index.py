import json
import os
from datetime import date, datetime
from decimal import Decimal

import psycopg2
import psycopg2.extras

SCHEMA = 't_p56928299_competency_assessmen'
TABLE = f'{SCHEMA}.warranty_claims'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}

STATUSES = ('not_filed', 'filed', 'replaced', 'refused', 'expired')


def esc(v):
    if v is None or v == '':
        return 'NULL'
    return "'" + str(v).replace("'", "''") + "'"


def num(v):
    if v is None or v == '':
        return 'NULL'
    try:
        return str(float(v))
    except (TypeError, ValueError):
        return 'NULL'


def intval(v):
    if v is None or v == '':
        return 'NULL'
    try:
        return str(int(v))
    except (TypeError, ValueError):
        return 'NULL'


def serialize(row):
    out = {}
    for k, v in dict(row).items():
        if isinstance(v, Decimal):
            out[k] = float(v)
        elif isinstance(v, (date, datetime)):
            out[k] = v.isoformat()
        else:
            out[k] = v
    return out


def handler(event: dict, context) -> dict:
    """Журнал гарантийных претензий к кадровым агентствам: список, создание, изменение и удаление записей"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    try:
        if method == 'GET':
            cur.execute(
                f'SELECT * FROM {TABLE} ORDER BY '
                "CASE claim_status WHEN 'not_filed' THEN 0 WHEN 'filed' THEN 1 ELSE 2 END, "
                'deadline NULLS LAST, id DESC'
            )
            rows = [serialize(r) for r in cur.fetchall()]

            cur.execute(
                f'SELECT claim_status, COUNT(*) AS cnt, '
                f'COALESCE(SUM(recruitment_cost), 0) AS total FROM {TABLE} GROUP BY claim_status'
            )
            stats = {r['claim_status']: {'count': int(r['cnt']), 'sum': float(r['total'])} for r in cur.fetchall()}

            return {
                'statusCode': 200,
                'headers': CORS,
                'isBase64Encoded': False,
                'body': json.dumps({'items': rows, 'stats': stats}, ensure_ascii=False),
            }

        body = json.loads(event.get('body') or '{}')

        if method == 'POST':
            status = body.get('claim_status') or 'not_filed'
            if status not in STATUSES:
                status = 'not_filed'

            cur.execute(
                f'INSERT INTO {TABLE} '
                '(employee_name, position, agency, hire_date, fire_date, tenure_months, '
                'recruitment_cost, guarantee_months, claim_status, claim_date, deadline, '
                'replacement_date, comment) VALUES ('
                f"{esc(body.get('employee_name'))}, {esc(body.get('position'))}, "
                f"{esc(body.get('agency'))}, {esc(body.get('hire_date'))}, "
                f"{esc(body.get('fire_date'))}, {num(body.get('tenure_months'))}, "
                f"{num(body.get('recruitment_cost'))}, {intval(body.get('guarantee_months'))}, "
                f"{esc(status)}, {esc(body.get('claim_date'))}, {esc(body.get('deadline'))}, "
                f"{esc(body.get('replacement_date'))}, {esc(body.get('comment'))}) RETURNING *"
            )
            return {
                'statusCode': 201,
                'headers': CORS,
                'isBase64Encoded': False,
                'body': json.dumps(serialize(cur.fetchone()), ensure_ascii=False),
            }

        if method == 'PUT':
            claim_id = intval(body.get('id'))
            if claim_id == 'NULL':
                return {
                    'statusCode': 400,
                    'headers': CORS,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'id обязателен'}, ensure_ascii=False),
                }

            fields = {
                'employee_name': esc,
                'position': esc,
                'agency': esc,
                'hire_date': esc,
                'fire_date': esc,
                'tenure_months': num,
                'recruitment_cost': num,
                'guarantee_months': intval,
                'claim_status': esc,
                'claim_date': esc,
                'deadline': esc,
                'replacement_date': esc,
                'comment': esc,
            }
            sets = [f'{k} = {fn(body[k])}' for k, fn in fields.items() if k in body]
            sets.append('updated_at = CURRENT_TIMESTAMP')

            cur.execute(f"UPDATE {TABLE} SET {', '.join(sets)} WHERE id = {claim_id} RETURNING *")
            row = cur.fetchone()
            if not row:
                return {
                    'statusCode': 404,
                    'headers': CORS,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Запись не найдена'}, ensure_ascii=False),
                }
            return {
                'statusCode': 200,
                'headers': CORS,
                'isBase64Encoded': False,
                'body': json.dumps(serialize(row), ensure_ascii=False),
            }

        if method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            claim_id = intval(body.get('id') or params.get('id'))
            if claim_id == 'NULL':
                return {
                    'statusCode': 400,
                    'headers': CORS,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'id обязателен'}, ensure_ascii=False),
                }
            cur.execute(f'DELETE FROM {TABLE} WHERE id = {claim_id}')
            return {
                'statusCode': 200,
                'headers': CORS,
                'isBase64Encoded': False,
                'body': json.dumps({'deleted': True}, ensure_ascii=False),
            }

        return {
            'statusCode': 405,
            'headers': CORS,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Метод не поддерживается'}, ensure_ascii=False),
        }
    finally:
        cur.close()
        conn.close()
