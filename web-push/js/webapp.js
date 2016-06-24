window.addEventListener('load', function() {
  document.getElementById('register').addEventListener('click', register, false);
  document.getElementById('push').addEventListener('click', setPush , false);
  navigator.serviceWorker.ready.then(checkPush);
}, false);

function register() {
  navigator.serviceWorker.register('push.js').then(checkNotification);
}

function checkNotification() {
  Notification.requestPermission(function(permission) {
    if(permission !== 'denied')
      document.getElementById('push').disabled = false;
    else
      alert('�v�b�V���ʒm��L���ɂł��܂���B�u���E�U�̐ݒ���m�F���ĉ������B');
  });
}

var subscription = null;

function checkPush(sw) {
  sw.pushManager.getSubscription().then(setSubscription, resetSubscription);
}

function setSubscription(s) {
  if(!s)
    resetSubscription();
  else {
    document.getElementById('register').disabled = true;
    subscription = s;
    var p = document.getElementById('push');
    p.textContent = '�v�b�V���ʒm����������';
    p.disabled = false;
    registerNotification(s);
  }
}

function resetSubscription() {
  document.getElementById('register').disabled = true;
  subscription = null;
  var p = document.getElementById('push');
  p.textContent = '�v�b�V���ʒm��L���ɂ���';
  p.disabled = false;
}

function setPush() {
  if(!subscription) {
    if(Notification.permission == 'denied') {
      alert('�v�b�V���ʒm��L���ɂł��܂���B�u���E�U�̐ݒ���m�F���ĉ������B');
      return;
    }

    navigator.serviceWorker.ready.then(subscribe);
  }

  else
    navigator.serviceWorker.ready.then(unsubscribe);
}

function subscribe(sw) {
  sw.pushManager.subscribe({
    userVisibleOnly: true
  }).then(setSubscription, resetSubscription);
}

function unsubscribe() {
  if(subscription) {
    // ������Web�A�v���T�[�o���Ƀv�b�V���ʒm�̉�����ʒm���鏈���������Ɏ���
    
    subscription.unsubscribe();
  }
  resetSubscription();
}

function registerNotification(s) {
  var endpoint = s.endpoint;
  // Chrome 43�ȑO�ւ̑Ώ�
  if(('subscriptionId' in s) && !s.endpoint.match(s.subscriptionId))
    endpoint += '/' + s.subscriptionId;
  // ������Web�A�v���T�[�o���Ƀv�b�V���ʒm��o�^���鏈���������Ɏ���
  // endpoint�Ƀv�b�V���T�[�r�X�̃G���h�|�C���g��URL���i�[�����
  
}