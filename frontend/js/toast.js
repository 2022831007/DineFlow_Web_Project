let toastTimeout;

function showToast(msg) {
  clearTimeout(toastTimeout);

  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  toastMsg.textContent = msg;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
