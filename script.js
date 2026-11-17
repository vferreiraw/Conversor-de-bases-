const BASES = [
  [10, 'Decimal'],
  [2, 'Binário'],
  [8, 'Octal'],
  [16, 'Hexadecimal'],
  [32, 'Base 32'],
  [36, 'Base 36'],
];
const DIG = '0123456789abcdefghijklmnopqrstuvwxyz';
const $ = (id) => document.getElementById(id);

function parse(s, b) {
  s = s.trim().toLowerCase().replace(/[\s_]/g, '');
  let neg = false;
  if (s[0] === '-') {
    neg = true;
    s = s.slice(1);
  }
  if (!s) return null;
  let n = 0n;
  const B = BigInt(b);
  for (const c of s) {
    const d = DIG.indexOf(c);
    if (d < 0 || d >= b)
      throw new Error('«' + c + '» não é um dígito válido na base ' + b + '.');
    n = n * B + BigInt(d);
  }
  return neg ? -n : n;
}
function fmt(n, b) {
  return n.toString(b).toUpperCase();
}
function render() {
  const b = +$('base').value,
    out = $('out');
  out.innerHTML = '';
  $('err').textContent = '';
  let n;
  try {
    n = parse($('val').value, b);
  } catch (e) {
    $('err').textContent = e.message;
    return;
  }
  if (n === null) return;
  for (const [base, name] of BASES) {
    const li = document.createElement('li');
    if (base === b) li.className = 'src';
    const txt = fmt(n, base);
    li.innerHTML =
      '<span class="n"></span><span class="v"></span><button type="button"></button>';
    li.children[0].textContent = name;
    li.children[1].textContent = txt;
    const btn = li.children[2];
    if (base === b) {
      btn.textContent = 'Copiar';
      btn.onclick = () => copy(txt, btn);
    } else {
      btn.textContent = 'Usar';
      btn.onclick = () => {
        $('base').value = base;
        $('val').value = txt;
        render();
      };
    }
    out.appendChild(li);
  }
}
function copy(t, btn) {
  try {
    navigator.clipboard.writeText(t).then(() => {
      btn.textContent = 'Copiado';
      setTimeout(() => (btn.textContent = 'Copiar'), 1200);
    });
  } catch (e) {}
}
$('val').addEventListener('input', render);
$('base').addEventListener('change', render);
render();
