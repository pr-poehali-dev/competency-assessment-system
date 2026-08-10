const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function buildClaimDoc(text: string): Blob {
  const lines = text.split('\n');

  const body = lines
    .map((raw) => {
      const line = raw.trim();
      if (!line) return '<p class="sp">&nbsp;</p>';
      if (line === 'ПРЕТЕНЗИЯ') return `<p class="title">${esc(line)}</p>`;
      if (line.startsWith('о гарантийной замене'))
        return `<p class="subtitle">${esc(line)}</p>`;
      if (line.startsWith('Руководителю'))
        return `<p class="right">${esc(line)}</p>`;
      if (line.startsWith('Исх.')) return `<p class="right">${esc(line)}</p>`;
      if (/^\d\./.test(line)) return `<p class="item">${esc(line)}</p>`;
      if (line.startsWith('_______'))
        return `<p class="sign">${esc(line)}</p>`;
      if (line.startsWith('должность'))
        return `<p class="signlabel">${esc(line)}</p>`;
      return `<p>${esc(line)}</p>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8">
<title>Претензия о гарантийной замене</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page { size: A4; margin: 2cm 1.5cm 2cm 3cm; }
body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; }
p { margin: 0 0 10pt 0; text-align: justify; text-indent: 1.25cm; }
p.right { text-align: right; text-indent: 0; margin-bottom: 4pt; }
p.title { text-align: center; text-indent: 0; font-weight: bold; font-size: 14pt; margin: 24pt 0 4pt 0; letter-spacing: 1pt; }
p.subtitle { text-align: center; text-indent: 0; margin-bottom: 20pt; }
p.item { text-indent: 1.25cm; margin-bottom: 6pt; }
p.sp { margin: 0; font-size: 6pt; text-indent: 0; }
p.sign { text-indent: 0; text-align: left; margin-top: 32pt; margin-bottom: 0; }
p.signlabel { text-indent: 0; text-align: left; font-size: 9pt; color: #444; }
</style>
</head>
<body>
${body}
</body>
</html>`;

  return new Blob(['\ufeff', html], { type: 'application/msword' });
}

export function downloadClaimDoc(text: string, employeeName?: string | null) {
  const blob = buildClaimDoc(text);
  const url = URL.createObjectURL(blob);
  const safe = (employeeName || 'бланк')
    .replace(/[\\/:*?"<>|]/g, '')
    .trim()
    .slice(0, 60);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Претензия ${safe}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
