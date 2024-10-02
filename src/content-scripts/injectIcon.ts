export default function kompassAILoadIcon() {
  const div = document.createElement('div');
  div.onclick = function () {
    alert(
      "Hello from KompassAI! \nYou're on the " + window.location.host + '! Wohoo!'
    );
  };
  div.id = 'KompassAI-icon-wrapper';

  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('icon128.png');
  img.alt = 'KompassAI icon';
  div.appendChild(img);

  document.body.appendChild(div);
}
