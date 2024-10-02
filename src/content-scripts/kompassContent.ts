const kompassNotify = () => {

    console.log(`hey! frontend! I am here!`);

    window.postMessage({
        action: 'kompassai-extension-ping',
        params: {
            timestamp: Date.now(),
        }
    });

    setTimeout(kompassNotify, 0.5 * 1000);
};

kompassNotify();