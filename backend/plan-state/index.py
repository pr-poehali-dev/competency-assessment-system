import json
import os
from typing import Any, Dict

import psycopg2
import psycopg2.extras

SCHEMA = 't_p56928299_competency_assessmen'
ALLOWED_STATUS = ('todo', 'doing', 'done')
MAX_NOTE = 280
MAX_AUTHOR = 120

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}


def esc(value: str) -> str:
    return value.replace("'", "''")


def reply(code: int, payload: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'statusCode': code,
        'headers': CORS,
        'isBase64Encoded': False,
        'body': json.dumps(payload, ensure_ascii=False, default=str),
    }


def load_tasks(cur) -> Dict[str, Any]:
    cur.execute(
        f'SELECT task_id, status, note, author, updated_at FROM {SCHEMA}.plan_tasks ORDER BY task_id'
    )
    tasks = {}
    for row in cur.fetchall():
        tasks[row['task_id']] = {
            'status': row['status'],
            'note': row['note'],
            'author': row['author'],
            'updatedAt': row['updated_at'].isoformat(),
        }
    return tasks


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """Общее хранилище статусов и комментариев задач плана работы: GET — прочитать все, POST — сохранить одну задачу."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'isBase64Encoded': False, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    if method == 'GET':
        tasks = load_tasks(cur)
        cur.close()
        conn.close()
        return reply(200, {'tasks': tasks})

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        task_id = str(body.get('taskId') or '').strip()

        if not task_id or len(task_id) > 16:
            cur.close()
            conn.close()
            return reply(400, {'error': 'Не указан идентификатор задачи'})

        status = str(body.get('status') or 'todo').strip()
        if status not in ALLOWED_STATUS:
            cur.close()
            conn.close()
            return reply(400, {'error': 'Недопустимый статус задачи'})

        note = str(body.get('note') or '').strip()[:MAX_NOTE]
        author = str(body.get('author') or '').strip()[:MAX_AUTHOR]

        cur.execute(
            f"INSERT INTO {SCHEMA}.plan_tasks (task_id, status, note, author, updated_at) "
            f"VALUES ('{esc(task_id)}', '{esc(status)}', '{esc(note)}', '{esc(author)}', NOW()) "
            f"ON CONFLICT (task_id) DO UPDATE SET status = EXCLUDED.status, note = EXCLUDED.note, "
            f"author = EXCLUDED.author, updated_at = NOW()"
        )

        tasks = load_tasks(cur)
        cur.close()
        conn.close()
        return reply(200, {'tasks': tasks})

    cur.close()
    conn.close()
    return reply(405, {'error': 'Метод не поддерживается'})
