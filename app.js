// StefDoces B2B - Virtual Assistant Automation Simulation

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const badge = chatToggle.querySelector('.badge');

    // Trigger buttons from outside the chat
    const openChatHeader = document.getElementById('open-chat-header');
    const openHeroChat = document.getElementById('open-hero-chat');

    // Chatbot State
    let currentState = 0;
    /*
       State Flow:
       0: Initial greeting and event type question (Options buttons)
       1: Wait for text input (Event Date)
       2: Wait for text input (Guest count)
       3: End / Lead Captured
    */
   
    let leadData = {
        eventType: '',
        date: '',
        guests: ''
    };

    let chatInitialized = false;

    // --- Chat Control ---
    const toggleChat = (e) => {
        if(e) e.preventDefault();
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            // Opened
            if (badge) badge.style.display = 'none'; // Hide badge once opened
            if (!chatInitialized) {
                initChat();
                chatInitialized = true;
            }
        }
    };

    chatToggle.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);

    if(openChatHeader) openChatHeader.addEventListener('click', toggleChat);
    if(openHeroChat) openHeroChat.addEventListener('click', toggleChat);

    // Auto-open chat if redirected from "sobre.html" with ?chat=1
    if (new URLSearchParams(window.location.search).get('chat') === '1') {
        // Small delay so the page finishes rendering before opening
        setTimeout(() => {
            toggleChat();
        }, 600);
        // Clean URL without reloading the page
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // --- Chat UI Helpers ---
    const scrollToBottom = () => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const addMessage = (text, sender, isHtml = false) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        
        if (isHtml) {
            msgDiv.innerHTML = text;
        } else {
            msgDiv.textContent = text;
        }
        
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    };

    const showTyping = (callback) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg bot typing-indicator`;
        msgDiv.innerHTML = `<div class="typing" style="padding: 0.2rem 0;"><span></span><span></span><span></span></div>`;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();

        setTimeout(() => {
            chatMessages.removeChild(msgDiv);
            callback();
        }, 1000 + Math.random() * 800);
    };

    const enableInput = (placeholder) => {
        chatInput.disabled = false;
        chatSend.disabled = false;
        chatInput.placeholder = placeholder;
        chatInput.focus();
    };

    const disableInput = () => {
        chatInput.disabled = true;
        chatSend.disabled = true;
        chatInput.value = '';
        chatInput.placeholder = "Aguarde...";
    };

    // --- State Machine ---
    
    const initChat = () => {
        showTyping(() => {
            addMessage("Olá! Sou a assistente virtual da Stef Doces. 🌸", 'bot');
            
            setTimeout(() => {
                showTyping(() => {
                    const question = `Para enviar o cardápio ideal, qual é a sua busca hoje com nossos brigadeiros?`;
                    const options = `
                        <div class="chat-options">
                            <button class="chat-option-btn" data-type="Caixas para Mimos/Presente">Caixas para Mimos/Presente</button>
                            <button class="chat-option-btn" data-type="Centos para Festa/Aniversário">Centos para Festa/Aniversário</button>
                            <button class="chat-option-btn" data-type="Grande Escala / Casamento">Grande Escala / Eventos</button>
                        </div>
                    `;
                    addMessage(question + options, 'bot', true);
                    attachOptionListeners();
                });
            }, 800);
        });
    };

    const attachOptionListeners = () => {
        const btns = chatMessages.querySelectorAll('.chat-option-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Disable all options after click
                btns.forEach(b => {
                    b.disabled = true;
                    b.style.opacity = '0.5';
                    b.style.cursor = 'default';
                });
                
                const type = e.target.getAttribute('data-type');
                leadData.eventType = type;
                e.target.style.background = 'var(--clr-primary)';
                e.target.style.color = '#fff';
                e.target.style.opacity = '1';

                addMessage(type, 'user');
                handleNextState();
            });
        });
    };

    const handleNextState = () => {
        currentState++;
        
        switch(currentState) {
            case 1:
                showTyping(() => {
                    addMessage(`Nossos brigadeiros vão deixar seu momento de ${leadData.eventType} inesquecível!`, 'bot');
                    setTimeout(() => {
                        showTyping(() => {
                            addMessage("Para qual data você precisa da encomenda? (Mês ou data exata)", 'bot');
                            enableInput("Ex: Dia 15 de Novembro...");
                        });
                    }, 500);
                });
                break;
            case 2:
                showTyping(() => {
                    addMessage(`Entendido. Você já sabe qual quantidade aproximada gostaria?`, 'bot');
                    enableInput("Ex: 1 cento, 50 unidades, 2 caixinhas...");
                });
                break;
            case 3:
                showTyping(() => {
                    addMessage(`Tudo anotado! As informações estão salvas. ✨`, 'bot');
                    
                    // Simulate backend submission console log
                    console.log("--- B2B Lead Captured (to be sent via API) ---");
                    console.log("Type:", leadData.eventType);
                    console.log("Date:", leadData.date);
                    console.log("Size:", leadData.guests);
                    console.log("-----------------------------------------");

                    setTimeout(() => {
                        showTyping(() => {
                            const endMessage = `
                                Acesse nosso cardápio de Brigadeiros e selecione os itens desejados para uma estimativa.
                                <br><br>
                                <button id="btn-open-catalog" class="btn btn-primary" style="font-size: 0.8rem; padding: 0.5rem 1rem; width: 100%; justify-content:center; margin-top: 10px; border:none; cursor:pointer;">
                                    Abrir Cardápio de Brigadeiros
                                </button>
                            `;
                            addMessage(endMessage, 'bot', true);
                            disableInput();
                            chatInput.placeholder = "Atendimento finalizado.";
                        });
                    }, 800);
                });
                break;
        }
    };

    // --- Input Handling ---
    const handleInput = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        disableInput();

        if (currentState === 1) {
            leadData.date = text;
            handleNextState();
        } else if (currentState === 2) {
            leadData.guests = text;
            handleNextState();
        }
    };

    chatSend.addEventListener('click', handleInput);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInput();
    });

    // --- Catalog and WhatsApp Logic ---
    const catalogModal = document.getElementById('catalog-modal');
    const closeCatalogBtn = document.getElementById('close-catalog');
    
    // Configurator Logic
    const flavorSelect = document.getElementById('flavor-select');
    const sizeSelect = document.getElementById('size-select');
    const boxPriceSpan = document.getElementById('box-price');
    const btnAddCart = document.getElementById('btn-add-cart');
    
    // Elements Output
    const cartItemsDiv = document.getElementById('cart-items');
    const spanTotal = document.getElementById('catalog-total');
    const btnWhatsapp = document.getElementById('send-whatsapp');
    
    const prices = {
        tradicional: { 4: 12, 6: 18, 25: 45, 50: 80, 100: 140 },
        premium: { 4: 15, 6: 20, 25: 60, 50: 90, 100: 160 }
    };

    let catalogTotal = 0;
    let selectedItemsList = [];

    // Initialize Box Pricing immediately
    const updateBoxPrice = () => {
        if(!flavorSelect || !sizeSelect) return;
        const isPremium = flavorSelect.options[flavorSelect.selectedIndex].getAttribute('data-premium') === 'true';
        const type = isPremium ? 'premium' : 'tradicional';
        const size = sizeSelect.value;
        const currentPrice = prices[type][size];
        
        boxPriceSpan.innerText = currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return currentPrice;
    };

    if(flavorSelect) flavorSelect.addEventListener('change', updateBoxPrice);
    if(sizeSelect) sizeSelect.addEventListener('change', updateBoxPrice);

    // Initial update when loading
    if(flavorSelect) updateBoxPrice();

    // Add to Local Cart List
    if(btnAddCart) {
        btnAddCart.addEventListener('click', () => {
            const flavorName = flavorSelect.options[flavorSelect.selectedIndex].text;
            const sizeValue = sizeSelect.value;
            const priceVal = updateBoxPrice(); // gets current evaluated price
            
            const itemString = `Caixa c/ ${sizeValue} unid. - ${flavorName}`;
            
            selectedItemsList.push({
                title: itemString,
                price: priceVal
            });
            
            catalogTotal += priceVal;
            updateCartUI();
        });
    }

    const updateCartUI = () => {
        if(selectedItemsList.length === 0) {
            cartItemsDiv.innerHTML = '<p class="empty-cart-msg">Nenhum item adicionado à sua lista ainda.</p>';
            btnWhatsapp.disabled = true;
        } else {
            btnWhatsapp.disabled = false;
            cartItemsDiv.innerHTML = '';
            selectedItemsList.forEach((item, index) => {
                const el = document.createElement('div');
                el.className = 'cart-item-row';
                el.innerHTML = `
                    <span class="cart-item-title">${item.title}</span>
                    <div class="cart-item-right">
                        <span class="cart-item-price">${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <button class="remove-item" data-index="${index}"><i data-lucide="trash-2"></i></button>
                    </div>
                `;
                cartItemsDiv.appendChild(el);
            });
            lucide.createIcons();
            
            // Add Remove listeners
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.getAttribute('data-index');
                    catalogTotal -= selectedItemsList[idx].price;
                    selectedItemsList.splice(idx, 1);
                    updateCartUI();
                });
            });
        }
        
        spanTotal.innerText = catalogTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Open Catalog from Chat
    document.addEventListener('click', (e) => {
        if(e.target && e.target.id === 'btn-open-catalog') {
            catalogModal.classList.remove('hidden');
            updateBoxPrice();
        }
    });

    if(closeCatalogBtn) {
        closeCatalogBtn.addEventListener('click', () => {
            catalogModal.classList.add('hidden');
        });
    }

    // Send to WhatsApp handler
    if(btnWhatsapp) {
        btnWhatsapp.addEventListener('click', () => {
            let text = `Olá Stef Doces! Gostaria de fazer meu orçamento:\n\n`;
            if (leadData.eventType) {
                text += `*Evento:* ${leadData.eventType}\n`;
                text += `*Data:* ${leadData.date}\n`;
            }
            text += `\n*Sabores Exatos Selecionados:*\n`;
            
            selectedItemsList.forEach(i => {
                text += `👉 ${i.title} (${i.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})\n`;
            });
            
            text += `\n*TOTAL:* ${catalogTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            
            const phoneNumber = "5511990056964";
            const encodedText = encodeURIComponent(text);
            const waUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
            
            window.open(waUrl, '_blank');
        });
    }

});
