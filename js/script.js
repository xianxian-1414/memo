// ローカルストレージのキー
const STORAGE_KEY = 'my_memo_notes';

// メモの配列、localStorageから読み込み
let notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// 初期メモがなければ一つ作成
if (notes.length === 0) {
    notes.push({ id: Date.now(), title: 'メモ1', body: '本文を入力ください。' });
}

let currentNoteId = notes[0].id;

const tabsEl = document.getElementById('tabs');
const addTabBtn = document.getElementById('add-tab');
const titleInput = document.getElementById('title');
const bodyTextarea = document.getElementById('body');
const saveBtn = document.getElementById('save-note');

// タイトル入力時に改行禁止を強制
titleInput.addEventListener('input', () => {
    titleInput.value = titleInput.value.replace(/\r?\n/g, ''); // 改行除去
});

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function renderTabs() {
    tabsEl.innerHTML = '';
    notes.forEach(note => {
    const tab = document.createElement('div');
    tab.className = 'tab' + (note.id === currentNoteId ? ' active' : '');
    tab.title = note.title || '(タイトルなし)';

    // タイトルは最大100文字以内
    tab.textContent = note.title ? note.title.slice(0, 20) + (note.title.length > 20 ? '…' : '') : '(タイトルなし)';

    tab.addEventListener('click', () => {
        if (currentNoteId !== note.id) {
        currentNoteId = note.id;
        renderTabs();
        renderEditor();
        }
    });

    // 削除ボタン
    const delBtn = document.createElement('button');
    delBtn.textContent = '×';
    delBtn.className = 'delete-btn';
    delBtn.title = 'メモを削除';
    delBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // タブ切替のクリックを防ぐ
        if (confirm('このメモを削除しますか？')) {
        deleteNote(note.id);
        }
    });
    tab.appendChild(delBtn);

    tabsEl.appendChild(tab);
    });

    // 新規追加時に右端へスクロール
    setTimeout(() => {
    tabsEl.scrollLeft = tabsEl.scrollWidth;
    }, 0);
}

function renderEditor() {
    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return;
    titleInput.value = note.title;
    bodyTextarea.value = note.body;
}

function createNewNote() {
    const newId = Date.now();
    const newNote = { id: newId, title: '', body: '' };
    notes.push(newNote);
    currentNoteId = newId;
    renderTabs();
    renderEditor();
    saveToStorage();
}

function saveNote() {
    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return;

    // バリデーション
    const trimmedTitle = titleInput.value.trim().replace(/\r?\n/g, '');
    if (trimmedTitle.length > 100) {
    alert('タイトルは100文字以内で入力してください。');
    return;
    }
    if (bodyTextarea.value.length > 1000) {
    alert('本文は1000文字以内で入力してください。');
    return;
    }

    note.title = trimmedTitle || '(タイトルなし)';
    note.body = bodyTextarea.value;
    renderTabs();
    saveToStorage();
    alert('メモを保存しました！');
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);

    if (notes.length === 0) {
    // メモが全て削除された場合は新しいメモを作成
    createNewNote();
    } else {
    if (currentNoteId === id) {
        // 削除したメモが編集中の場合、先頭のメモを表示
        currentNoteId = notes[0].id;
    }
    renderTabs();
    renderEditor();
    saveToStorage();
    }
}

addTabBtn.addEventListener('click', createNewNote);
saveBtn.addEventListener('click', saveNote);

// 初期描画
renderTabs();
renderEditor();
