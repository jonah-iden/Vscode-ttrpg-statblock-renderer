// Runs inside the Markdown preview: clicking an HP box crosses it off.
// The state only lives in this preview. It survives document edits, but not closing the preview.
(function () {
	/** Keys of crossed-off boxes, see boxKey(). */
	const crossed = new Set();

	/** "<statblock name>#<nth statblock with that name>/<box index>", stable while editing other statblocks. */
	function boxKey(box) {
		const block = box.closest('.statblock');
		const name = block.querySelector('.sb-name')?.textContent ?? '';
		const sameName = [...document.querySelectorAll('.statblock')]
			.filter(b => (b.querySelector('.sb-name')?.textContent ?? '') === name);
		const boxes = [...block.querySelectorAll('.sb-hp-box')];
		return `${name}#${sameName.indexOf(block)}/${boxes.indexOf(box)}`;
	}

	function hpBox(event) {
		return event.target instanceof Element ? event.target.closest('.statblock .sb-hp-box') : null;
	}

	document.addEventListener('click', event => {
		const box = hpBox(event);
		if (!box) {
			return;
		}
		const key = boxKey(box);
		if (crossed.has(key)) {
			crossed.delete(key);
		} else {
			crossed.add(key);
		}
		box.classList.toggle('sb-hp-crossed', crossed.has(key));
	});

	// Clicking quickly should not trigger the preview's "double-click to switch to editor".
	document.addEventListener('dblclick', event => {
		if (hpBox(event)) {
			event.stopPropagation();
		}
	}, true);

	// The preview re-renders on every document change, so re-apply the state afterwards.
	window.addEventListener('vscode.markdown.updateContent', () => {
		for (const box of document.querySelectorAll('.statblock .sb-hp-box')) {
			box.classList.toggle('sb-hp-crossed', crossed.has(boxKey(box)));
		}
	});
})();
