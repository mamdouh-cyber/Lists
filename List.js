// ===== Database Setup =====
const DB_NAME = 'ModernNotepadDB';
const DB_VERSION = 1;
const STORE_NAME = 'notepads';

let db = null;
let notepadCounter = 0;

// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('name', 'name', { unique: false });
                objectStore.createIndex('createdAt', 'createdAt', { unique: false });
            }
        };
    });
}

// ===== Database Operations =====
async function saveNotepad(name, content) {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const notepad = {
            name: name,
            content: content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const request = store.add(notepad);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function updateNotepad(id, name, content) {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get(id);
        
        getRequest.onsuccess = () => {
            const notepad = getRequest.result;
            if (notepad) {
                notepad.name = name;
                notepad.content = content;
                notepad.updatedAt = new Date().toISOString();
                const updateRequest = store.put(notepad);
                
                updateRequest.onsuccess = () => resolve(updateRequest.result);
                updateRequest.onerror = () => reject(updateRequest.error);
            } else {
                reject(new Error('Notepad not found'));
            }
        };
        getRequest.onerror = () => reject(getRequest.error);
    });
}

async function getAllNotepads() {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getNotepadById(id) {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function deleteNotepad(id) {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// ===== UI Functions =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function createNotepadCard(id, name, content = '', isSaved = false) {
    const card = document.createElement('div');
    card.className = 'notepad-card';
    card.dataset.notepadId = id || `temp-${notepadCounter++}`;
    card.dataset.isSaved = isSaved;
    
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const charCount = content.length;
    const escapedName = escapeHtml(name || 'Untitled Notepad');
    
    card.innerHTML = `
        <div class="notepad-header">
            <div class="notepad-title" contenteditable="true" data-placeholder="Untitled Notepad">${escapedName}</div>
            <div class="notepad-actions-header">
                <button class="btn-icon sidebar-toggle-btn" title="View saved notepads">
                    <i class="fas fa-book"></i>
                </button>
                <button class="btn-icon delete-card-btn" title="Delete notepad">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="notepad-body">
            <textarea class="notepad-textarea" placeholder="Start typing your notes here..."></textarea>
        </div>
        <div class="notepad-footer">
            <div class="notepad-info">
                <i class="fas fa-font"></i>
                <span>${wordCount} words, ${charCount} characters</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                ${isSaved ? `
                    <button class="btn-save update-card-btn" title="Update saved notepad">
                        <i class="fas fa-save"></i>
                        <span>Update</span>
                    </button>
                ` : `
                    <button class="btn-save save-card-btn" title="Save notepad">
                        <i class="fas fa-save"></i>
                        <span>Save</span>
                    </button>
                `}
            </div>
        </div>
    `;
    
    // Get elements after innerHTML is set
    const textarea = card.querySelector('.notepad-textarea');
    const title = card.querySelector('.notepad-title');
    const wordCountEl = card.querySelector('.notepad-info span');
    
    // Set textarea content safely and ensure it's ALWAYS editable
    if (textarea) {
        textarea.value = content;
        // Explicitly make it editable - remove ALL restrictions
        textarea.removeAttribute('readonly');
        textarea.removeAttribute('disabled');
        textarea.readOnly = false;
        textarea.disabled = false;
        textarea.setAttribute('contenteditable', 'false'); // Keep false for textarea
        textarea.style.pointerEvents = 'auto';
        textarea.style.cursor = 'text';
        textarea.style.backgroundColor = '#ffffff';
        textarea.style.userSelect = 'text';
        textarea.style.webkitUserSelect = 'text';
        textarea.style.mozUserSelect = 'text';
        textarea.style.msUserSelect = 'text';
        // Ensure it can receive focus
        textarea.tabIndex = 0;
        
        // Force enable input
        textarea.onfocus = function() {
            this.readOnly = false;
            this.disabled = false;
        };
        
        // Test if it's actually editable
        console.log('Textarea editable check:', {
            readOnly: textarea.readOnly,
            disabled: textarea.disabled,
            pointerEvents: textarea.style.pointerEvents,
            tabIndex: textarea.tabIndex
        });
    }
    
    // Add button event listeners
    const sidebarToggleBtn = card.querySelector('.sidebar-toggle-btn');
    const deleteCardBtn = card.querySelector('.delete-card-btn');
    const saveBtn = card.querySelector('.save-card-btn');
    const updateBtn = card.querySelector('.update-card-btn');
    
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', toggleSidebar);
    }
    
    if (deleteCardBtn) {
        deleteCardBtn.addEventListener('click', () => deleteNotepadCard(deleteCardBtn));
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => saveNotepadCard(saveBtn));
    }
    
    if (updateBtn) {
        updateBtn.addEventListener('click', () => updateNotepadCard(updateBtn));
    }
    
    // Update word count on input - ensure textarea is fully functional
    if (textarea && wordCountEl) {
        // Make absolutely sure it's editable
        textarea.readOnly = false;
        textarea.disabled = false;
        textarea.removeAttribute('readonly');
        textarea.removeAttribute('disabled');
        
        // Add input event listener
        textarea.addEventListener('input', function(e) {
            const content = this.value;
            const words = content.split(/\s+/).filter(word => word.length > 0).length;
            const chars = content.length;
            wordCountEl.textContent = `${words} words, ${chars} characters`;
            console.log('Textarea input detected:', { words, chars });
        });
        
        // Add keydown to ensure typing works
        textarea.addEventListener('keydown', function(e) {
            console.log('Key pressed in textarea:', e.key);
            // Don't prevent default - allow all keys
        });
        
        // Add click event to ensure focus works
        textarea.addEventListener('click', function(e) {
            this.focus();
            this.readOnly = false;
            this.disabled = false;
            console.log('Textarea clicked and focused');
        });
        
        // Test if we can actually type
        setTimeout(() => {
            textarea.focus();
            console.log('Textarea focus test:', {
                isFocused: document.activeElement === textarea,
                readOnly: textarea.readOnly,
                disabled: textarea.disabled,
                value: textarea.value.length
            });
        }, 100);
    }
    
    // Ensure title is editable
    if (title) {
        title.contentEditable = 'true';
        title.setAttribute('contenteditable', 'true');
        
        // Handle title editing
        title.addEventListener('blur', () => {
            if (!title.textContent.trim()) {
                title.textContent = 'Untitled Notepad';
            }
        });
        
        // Prevent empty title
        title.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                title.blur();
            }
        });
    }
    
    return card;
}

function addNotepadCard(name = '', content = '', isSaved = false, id = null) {
    const grid = document.getElementById('notepadsGrid');
    if (!grid) {
        console.error('Notepads grid not found!');
        return;
    }
    
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const card = createNotepadCard(id, name, content, isSaved);
    if (!card) {
        console.error('Failed to create notepad card!');
        return;
    }
    
    grid.appendChild(card);
    console.log('Notepad card added to grid:', { name, id, isSaved, gridChildren: grid.children.length });
    
    // Scroll to new card with animation
    setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
    
    // Focus textarea and ensure it's ALWAYS editable
    const textarea = card.querySelector('.notepad-textarea');
    if (textarea) {
        // Explicitly make it editable - FORCE IT
        textarea.removeAttribute('readonly');
        textarea.removeAttribute('disabled');
        textarea.readOnly = false;
        textarea.disabled = false;
        textarea.style.pointerEvents = 'auto';
        textarea.style.cursor = 'text';
        textarea.style.backgroundColor = '#ffffff';
        textarea.style.userSelect = 'text';
        textarea.tabIndex = 0;
        
        // Add a test click handler
        textarea.onclick = function() {
            this.focus();
            this.readOnly = false;
            this.disabled = false;
        };
        
        setTimeout(() => {
            textarea.focus();
            // Move cursor to end of text
            if (textarea.value.length > 0) {
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);
            }
            // Force editable state again after focus
            textarea.readOnly = false;
            textarea.disabled = false;
            console.log('Textarea focused and ready:', {
                readOnly: textarea.readOnly,
                disabled: textarea.disabled,
                canType: !textarea.readOnly && !textarea.disabled
            });
        }, 200);
    }
}

async function saveNotepadCard(button) {
    const card = button.closest('.notepad-card');
    const title = card.querySelector('.notepad-title').textContent.trim() || 'Untitled Notepad';
    const content = card.querySelector('.notepad-textarea').value;
    
    if (!content.trim()) {
        showToast('Please add some content before saving', 'error');
        return;
    }
    
    try {
        const id = await saveNotepad(title, content);
        card.dataset.notepadId = id;
        card.dataset.isSaved = 'true';
        
        // Update button
        button.innerHTML = `
            <i class="fas fa-save"></i>
            <span>Update</span>
        `;
        button.onclick = () => updateNotepadCard(button);
        
        showToast(`"${title}" saved successfully!`);
        await loadSavedNotepads();
    } catch (error) {
        console.error('Error saving notepad:', error);
        showToast('Failed to save notepad', 'error');
    }
}

async function updateNotepadCard(button) {
    const card = button.closest('.notepad-card');
    const id = parseInt(card.dataset.notepadId);
    const title = card.querySelector('.notepad-title').textContent.trim() || 'Untitled Notepad';
    const content = card.querySelector('.notepad-textarea').value;
    
    try {
        await updateNotepad(id, title, content);
        showToast(`"${title}" updated successfully!`);
        await loadSavedNotepads();
    } catch (error) {
        console.error('Error updating notepad:', error);
        showToast('Failed to update notepad', 'error');
    }
}

async function deleteNotepadCard(button) {
    const card = button.closest('.notepad-card');
    const id = card.dataset.notepadId;
    const isSaved = card.dataset.isSaved === 'true';
    const title = card.querySelector('.notepad-title').textContent.trim();
    
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
        if (isSaved && !id.toString().startsWith('temp-')) {
            try {
                await deleteNotepad(parseInt(id));
                showToast(`"${title}" deleted successfully!`);
                await loadSavedNotepads();
            } catch (error) {
                console.error('Error deleting notepad:', error);
                showToast('Failed to delete notepad', 'error');
            }
        }
        
        // Animate card removal
        card.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            card.remove();
            checkEmptyState();
        }, 300);
    }
}

function checkEmptyState() {
    const grid = document.getElementById('notepadsGrid');
    if (grid.children.length === 0) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.id = 'welcomeMessage';
        welcomeMessage.innerHTML = `
            <i class="fas fa-lightbulb"></i>
            <h2>Welcome to Modern Notepad!</h2>
            <p>Click "New Notepad" to create your first notepad</p>
        `;
        grid.appendChild(welcomeMessage);
    }
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
    }
`;
document.head.appendChild(style);

async function loadSavedNotepads() {
    const sidebar = document.getElementById('savedNotepads');
    
    try {
        const notepads = await getAllNotepads();
        sidebar.innerHTML = '';
        
        // Ensure sidebar content is clickable
        sidebar.style.pointerEvents = 'auto';
        sidebar.style.zIndex = '10';
        sidebar.style.position = 'relative';
        
        if (notepads.length === 0) {
            sidebar.innerHTML = '<p class="empty-message">No saved notepads yet</p>';
            return;
        }
        
        // Sort by updated date (newest first)
        notepads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        notepads.forEach(notepad => {
            const item = document.createElement('div');
            item.className = 'saved-notepad-item';
            const escapedName = escapeHtml(notepad.name);
            const notepadId = notepad.id;
            const notepadName = notepad.name; // Store original name for use in functions
            
            // Create elements safely
            const nameDiv = document.createElement('div');
            nameDiv.className = 'notepad-name';
            nameDiv.textContent = notepadName;
            nameDiv.title = notepadName;
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'notepad-actions';
            
            const loadBtn = document.createElement('button');
            loadBtn.className = 'btn-load-notepad';
            loadBtn.title = 'Open and Edit this notepad';
            loadBtn.innerHTML = '<i class="fas fa-edit"></i> <span>Open & Edit</span>';
            // Ensure button is clickable
            loadBtn.style.pointerEvents = 'auto';
            loadBtn.style.cursor = 'pointer';
            loadBtn.style.zIndex = '100';
            loadBtn.style.position = 'relative';
            loadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                loadNotepad(notepadId);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-icon delete-saved-btn';
            deleteBtn.title = 'Delete saved notepad';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            // Ensure button is clickable
            deleteBtn.style.pointerEvents = 'auto';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.zIndex = '100';
            deleteBtn.style.position = 'relative';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                deleteSavedNotepad(notepadId, notepadName);
            });
            
            actionsDiv.appendChild(loadBtn);
            actionsDiv.appendChild(deleteBtn);
            item.appendChild(nameDiv);
            item.appendChild(actionsDiv);
            
            // Make the whole item clickable to load the notepad
            item.style.cursor = 'pointer';
            item.style.pointerEvents = 'auto';
            item.style.zIndex = '10';
            item.style.position = 'relative';
            
            // Ensure name div is clickable
            nameDiv.style.pointerEvents = 'auto';
            nameDiv.style.cursor = 'pointer';
            nameDiv.style.zIndex = '10';
            nameDiv.style.position = 'relative';
            
            item.addEventListener('click', (e) => {
                // Only load if clicking on the item itself, not on buttons
                if (e.target === item || e.target === nameDiv || e.target.closest('.notepad-name')) {
                    e.stopPropagation();
                    loadNotepad(notepadId);
                }
            });
            
            sidebar.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading saved notepads:', error);
        sidebar.innerHTML = '<p class="empty-message">Error loading notepads</p>';
    }
}

async function loadNotepad(id) {
    try {
        console.log('Loading notepad with ID:', id);
        const notepad = await getNotepadById(id);
        console.log('Loaded notepad:', notepad);
        
        if (notepad) {
            // Ensure content is a string (handle null/undefined)
            const content = notepad.content || '';
            const name = notepad.name || 'Untitled Notepad';
            console.log('Adding notepad card:', { name, contentLength: content.length, id: notepad.id });
            
            // Load the notepad as saved (so it shows Update button)
            addNotepadCard(name, content, true, notepad.id);
            showToast(`"${name}" loaded! You can now edit and resave it.`);
            toggleSidebar();
            
            // Ensure the loaded notepad is fully editable and writable
            setTimeout(() => {
                const grid = document.getElementById('notepadsGrid');
                const cards = grid.querySelectorAll('.notepad-card');
                if (cards.length > 0) {
                    const lastCard = cards[cards.length - 1];
                    const textarea = lastCard.querySelector('.notepad-textarea');
                    const title = lastCard.querySelector('.notepad-title');
                    const updateBtn = lastCard.querySelector('.update-card-btn');
                    
                    if (textarea) {
                        // Remove any restrictions
                        textarea.removeAttribute('readonly');
                        textarea.removeAttribute('disabled');
                        textarea.readOnly = false;
                        textarea.disabled = false;
                        textarea.style.pointerEvents = 'auto';
                        textarea.style.cursor = 'text';
                        textarea.style.backgroundColor = '#ffffff';
                        textarea.tabIndex = 0;
                        
                        // Focus and make it ready for typing
                        textarea.focus();
                        if (textarea.value.length > 0) {
                            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                        }
                        
                        // Add a visual indicator that it's editable
                        textarea.style.borderColor = 'var(--primary-color)';
                        setTimeout(() => {
                            textarea.style.borderColor = '';
                        }, 1000);
                    }
                    
                    if (title) {
                        title.contentEditable = 'true';
                        title.setAttribute('contenteditable', 'true');
                    }
                    
                    // Ensure Update button is visible and working
                    if (updateBtn) {
                        updateBtn.style.display = 'flex';
                        console.log('Update button ready for resaving');
                    }
                    
                    console.log('Notepad loaded and ready for editing:', {
                        name,
                        id: notepad.id,
                        contentLength: content.length,
                        isEditable: !textarea?.readOnly && !textarea?.disabled
                    });
                }
            }, 300);
        } else {
            console.error('Notepad not found for ID:', id);
            showToast('Notepad not found', 'error');
        }
    } catch (error) {
        console.error('Error loading notepad:', error);
        showToast('Failed to load notepad', 'error');
    }
}

async function deleteSavedNotepad(id, name) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
        try {
            await deleteNotepad(id);
            showToast(`"${name}" deleted successfully!`);
            await loadSavedNotepads();
        } catch (error) {
            console.error('Error deleting notepad:', error);
            showToast('Failed to delete notepad', 'error');
        }
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    sidebar.classList.toggle('active');
    if (backdrop) {
        backdrop.classList.toggle('active');
    }
    
    // Ensure ALL sidebar elements are clickable
    setTimeout(() => {
        const closeTop = document.getElementById('closeSidebar');
        const closeBottom = document.getElementById('closeSidebarBottom');
        const sidebarContent = document.getElementById('savedNotepads');
        
        // Fix close buttons
        if (closeTop) {
            closeTop.style.pointerEvents = 'auto';
            closeTop.style.cursor = 'pointer';
            closeTop.style.zIndex = '1000';
        }
        
        if (closeBottom) {
            closeBottom.style.pointerEvents = 'auto';
            closeBottom.style.cursor = 'pointer';
            closeBottom.style.zIndex = '1000';
        }
        
        // Fix all buttons in sidebar
        const allButtons = sidebar.querySelectorAll('button');
        allButtons.forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = '100';
            btn.style.position = 'relative';
        });
        
        // Fix all saved notepad items
        const allItems = sidebar.querySelectorAll('.saved-notepad-item');
        allItems.forEach(item => {
            item.style.pointerEvents = 'auto';
            item.style.cursor = 'pointer';
            item.style.zIndex = '10';
            item.style.position = 'relative';
        });
        
        // Fix all textareas and inputs
        const allInputs = sidebar.querySelectorAll('textarea, input, select');
        allInputs.forEach(input => {
            input.style.pointerEvents = 'auto';
            input.style.cursor = 'text';
            input.style.zIndex = '10';
            input.style.position = 'relative';
        });
        
        // Ensure sidebar content is clickable
        if (sidebarContent) {
            sidebarContent.style.pointerEvents = 'auto';
            sidebarContent.style.zIndex = '10';
            sidebarContent.style.position = 'relative';
        }
        
        // Ensure sidebar itself is clickable
        sidebar.style.pointerEvents = 'auto';
        sidebar.style.zIndex = '999';
    }, 100);
}

// ===== Modal Functions =====
function showNameModal() {
    const modal = document.getElementById('nameModal');
    const input = document.getElementById('notepadName');
    modal.classList.add('active');
    input.value = '';
    setTimeout(() => input.focus(), 100);
}

function hideNameModal() {
    const modal = document.getElementById('nameModal');
    modal.classList.remove('active');
}

function createNotepadWithName() {
    const input = document.getElementById('notepadName');
    const name = input.value.trim() || 'Untitled Notepad';
    
    if (name.length > 50) {
        showToast('Notepad name must be 50 characters or less', 'error');
        return;
    }
    
    addNotepadCard(name);
    hideNameModal();
    showToast(`"${name}" created!`);
}

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize database
    try {
        await initDB();
        await loadSavedNotepads();
    } catch (error) {
        console.error('Error initializing database:', error);
        showToast('Failed to initialize database', 'error');
    }
    
    // Create button
    document.getElementById('createBtn').addEventListener('click', () => {
        addNotepadCard();
        showToast('New notepad created!');
        
        // Immediately ensure the new notepad is editable
        setTimeout(() => {
            makeAllTextareasEditable();
            const grid = document.getElementById('notepadsGrid');
            const cards = grid.querySelectorAll('.notepad-card');
            if (cards.length > 0) {
                const lastCard = cards[cards.length - 1];
                const textarea = lastCard.querySelector('.notepad-textarea');
                if (textarea) {
                    textarea.focus();
                    console.log('New notepad textarea ready:', {
                        readOnly: textarea.readOnly,
                        disabled: textarea.disabled,
                        canType: !textarea.readOnly && !textarea.disabled
                    });
                }
            }
        }, 100);
    });
    
    // Modal buttons
    document.getElementById('closeModal').addEventListener('click', hideNameModal);
    document.getElementById('cancelBtn').addEventListener('click', hideNameModal);
    document.getElementById('saveNameBtn').addEventListener('click', createNotepadWithName);
    
    // Close modal on outside click
    document.getElementById('nameModal').addEventListener('click', (e) => {
        if (e.target.id === 'nameModal') {
            hideNameModal();
        }
    });
    
    // Enter key in modal
    document.getElementById('notepadName').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            createNotepadWithName();
        } else if (e.key === 'Escape') {
            hideNameModal();
        }
    });
    
    // Sidebar toggle - top close button
    const closeSidebarTop = document.getElementById('closeSidebar');
    if (closeSidebarTop) {
        closeSidebarTop.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
        // Ensure it's clickable
        closeSidebarTop.style.pointerEvents = 'auto';
        closeSidebarTop.style.cursor = 'pointer';
        closeSidebarTop.style.zIndex = '1000';
    }
    
    // Sidebar toggle - bottom close button
    const closeSidebarBottom = document.getElementById('closeSidebarBottom');
    if (closeSidebarBottom) {
        closeSidebarBottom.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
        // Ensure it's clickable
        closeSidebarBottom.style.pointerEvents = 'auto';
        closeSidebarBottom.style.cursor = 'pointer';
        closeSidebarBottom.style.zIndex = '1000';
    }
    
    // Mobile menu button
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar on backdrop click (mobile)
    const backdrop = document.getElementById('sidebarBackdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                toggleSidebar();
            }
        });
    }
    
    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (sidebar && sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            e.target !== mobileMenuBtn && 
            !mobileMenuBtn?.contains(e.target) &&
            e.target !== backdrop &&
            !backdrop?.contains(e.target)) {
            if (window.innerWidth <= 1024) {
                toggleSidebar();
            }
        }
    });
    
    // Auto-save indicator (optional - can be enhanced)
    setInterval(() => {
        const cards = document.querySelectorAll('.notepad-card[data-is-saved="true"]');
        cards.forEach(card => {
            const textarea = card.querySelector('.notepad-textarea');
            if (textarea.dataset.lastSaved !== textarea.value) {
                // Could add visual indicator here
            }
        });
    }, 5000);
});

// Function to force make all textareas editable
function makeAllTextareasEditable() {
    const textareas = document.querySelectorAll('.notepad-textarea');
    textareas.forEach(textarea => {
        textarea.removeAttribute('readonly');
        textarea.removeAttribute('disabled');
        textarea.readOnly = false;
        textarea.disabled = false;
        textarea.style.pointerEvents = 'auto';
        textarea.style.cursor = 'text';
        textarea.style.userSelect = 'text';
        textarea.tabIndex = 0;
        
        // Add click handler to ensure it's editable
        textarea.onclick = function() {
            this.focus();
            this.readOnly = false;
            this.disabled = false;
        };
        
        console.log('Fixed textarea:', {
            readOnly: textarea.readOnly,
            disabled: textarea.disabled,
            id: textarea.closest('.notepad-card')?.dataset.notepadId
        });
    });
    return textareas.length;
}

// Make functions globally available
window.saveNotepadCard = saveNotepadCard;
window.updateNotepadCard = updateNotepadCard;
window.deleteNotepadCard = deleteNotepadCard;
window.loadNotepad = loadNotepad;
window.deleteSavedNotepad = deleteSavedNotepad;
window.toggleSidebar = toggleSidebar;
window.makeAllTextareasEditable = makeAllTextareasEditable;

// Run this periodically to ensure textareas stay editable
setInterval(() => {
    makeAllTextareasEditable();
}, 2000);