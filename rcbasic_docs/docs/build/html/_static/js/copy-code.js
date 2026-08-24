function copyCode(btn) {
  const code = btn.parentElement.querySelector("div").innerText;

  navigator.clipboard.writeText(code).then(() => {
    btn.innerHTML = '<img src="../_static/js/check.png" width="16" height="16">';

    setTimeout(() => {
      btn.innerHTML = '<img src="../_static/js/copy-icon.png" width="16" height="16">';
    }, 2000);

  }).catch(() => {
    btn.innerText = 'Error';
  });
}