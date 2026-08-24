function copyCode(btn) {
  const code = btn.parentElement.querySelector("code").innerText;

  navigator.clipboard.writeText(code).then(() => {
    btn.innerHTML = '<img src="../assets/icon/check.png" width="16" height="16">';

    setTimeout(() => {
      btn.innerHTML = '<img src="../assets/icon/copy-icon.png" width="16" height="16">';
    }, 2000);

  }).catch(() => {
    btn.innerText = 'Error';
  });
}