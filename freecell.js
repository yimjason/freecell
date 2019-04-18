
	Array.prototype.shuffle = function() {
	  var m = this.length, t, i; 
	  while (m) { 
	    i = Math.floor(Math.random() * m--); 
	    t = this[m];
	    this[m] = this[i];
	    this[i] = t;
	  } 
	  return this;
	};
	  
	function Board(){ 
		this.space = 5;
		this.CASCADES = 8;
		this.FOUNDATIONS = 4; 
		this.FREECELLS = 4;
		this.cascades = [];
		this.foundations = [];
		this.freecells = [];
		this.temp = [];
		this.win = false; 
		this.deck = new Deck();
		this.create(this.foundations, this.FOUNDATIONS);
		this.create(this.cascades, this.CASCADES);
		this.create(this.freecells, this.FREECELLS);
		this.createGUI();
		this.start(); 
	}
	
	Board.prototype.createGUI = function(){
	    this.gui = document.createElement('div'); 
	    this.id = document.createElement('h1');
	    this.foundationsGUI = document.createElement('div');
	    this.resetGUI = document.createElement('div');
	    this.freecellsGUI = document.createElement('div'); 
	    this.cascadesGUI = document.createElement('div');
	    this.logo = document.createElement('div');
	    
	    this.gui.className = 'board';
	    this.foundationsGUI.className = 'foundations';
	    this.freecellsGUI.className = 'freecells';
	    this.cascadesGUI.className = 'cascades';
	    this.resetGUI.className = 'reset_button';
	    this.logo.className = 'logo';
	     
	    this.createGUI_columns(this.foundations, this.FOUNDATIONS, this.foundationsGUI, 'foundation');
	    this.createGUI_columns(this.freecells, this.FREECELLS, this.freecellsGUI, 'freecell');
	    this.createGUI_columns(this.cascades, this.CASCADES, this.cascadesGUI, 'cascade');
	    this.id.innerHTML = 'FREE CELL'; 
	    this.resetGUI.setAttribute('onclick', 'board.reset()');
	    
	    this.gui.appendChild(this.id);
	    this.gui.appendChild(this.foundationsGUI);
	    this.gui.appendChild(this.resetGUI);
	    this.gui.appendChild(this.freecellsGUI);
	    this.gui.appendChild(this.logo);
	    this.gui.appendChild(this.cascadesGUI);
	    this.gui.appendChild(this.deck.gui);
	    document.body.appendChild(this.gui);
	};
	
	Board.prototype.createGUI_columns = function(array, length, parent, type){
	    for(var i = 0; i < length; i++){
	        var column = document.createElement('div');
	        column.className = type;
	        column.setAttribute('id', type + i);  
	        parent.appendChild(column);
	    } 
	};
	
	Board.prototype.reset = function(){
	    document.body.innerHTML = '';  
	    board = new Board;
	};
	
	Board.prototype.start = function(){
	    this.deck.cards = this.deck.cards.shuffle();
	    this.deal();
	    this.set_card_ids(this.cascades, 'cascade');
	    this.render();
	    this.auto_play();
	};
	
	Board.prototype.create = function(array, length){
	    for(var x = 0; x < length; x++){
	        array[x] = [];
	    }
	};
	
	Board.prototype.deal = function(){
	    var column = 0;  
		for(var i = 0; i < this.deck.CARDS; i++){ 
			if(column > 7){column = 0;}  
			this.move(1, this.deck.cards, this.cascades[column]);
			column++;
		} 
	};
	
	Board.prototype.set_card_ids = function(stack, type){
		for(var x = 0; x < stack.length; x++){
			for(var y = 0; y < stack[x].length; y++){
				var card = stack[x][y].gui;
				card.setAttribute('id', type+x+','+y);  
				card.setAttribute('onmouseup', 'board.place(this)');
			}
		}	
	};
	  
	Board.prototype.move = function(amount_of_cards, from, to){
		if(from.length <= 0){return;}
		for(var e = 0; e < amount_of_cards; e++){
			to.push(from.pop());
		}
	};
	
	Board.prototype.check_victory = function(){
		var cards = 0;
		for(var x = 0; x < this.foundations.length; x++){
			for(var y = 0; y < this.foundations[x].length; y++){
				cards++;
			}
		}
		if(cards == 52){this.win = true;}
	};
	
	Board.prototype.auto_play = function(){
		for(var x = 0; x < this.cascades.length; x++){
			for(var y =0; y < this.cascades[x].length; y++){
				if(this.place_in_foundations(this.cascades, x, y)){this.render();this.auto_play();}
			}
		}
		for(x = 0; x < this.freecells.length; x++){
			for(y =0; y < this.freecells[x].length; y++){
				if(this.place_in_foundations(this.freecells, x, y)){this.render();}
			}
		}
	};
	
	Board.prototype.place = function(card_gui){
	    var placed = false;
	    var array = card_gui.id.split(','); 
	    var column = array[0];
	    var column_index = column.charAt(column.length-1);
	    var card_index = parseInt(array[1], 10); 
	    var type = array[0].substr(0, column.length-1);
	    var current_slot; 
	    
	    switch(type){
	    	case 'foundation': current_slot = this.foundations;break;
	    	case 'freecell': current_slot = this.freecells;break;
	    	case 'cascade': current_slot = this.cascades;break;
	    	default: current_slot = this.deck.cards;
	    } 
	     
	    if(!placed){ placed = this.place_in_foundations(current_slot, column_index, card_index); }
	    if(!placed){ placed = this.place_in_cascades(current_slot, column_index, card_index); }
	    if(!placed){ placed = this.place_in_freecells(current_slot, column_index, card_index); }
	    console.log(type); 
	    this.update_freecells(); 
	    console.log('space: '+this.space);
	    this.check_victory();
	    this.render();
	    this.auto_play();
	};
	
	Board.prototype.update_freecells = function(){
		var freecells = 1;
		for(var x = 0; x < this.freecells.length; x++){
			if(this.freecells[x].length == 0){
				freecells+=1;
			} 
		}
		for(var y = 0; y < this.cascades.length; y++){
			if(this.cascades[y].length == 0){
				freecells+=1;
			} 
		}
		this.space = freecells;
	};
	
	Board.prototype.place_in_foundations = function(section, column, card_index){
		var current_slot = section[column];
		var card = current_slot[card_index];
		if(card != last_card(current_slot)){return false;}
	    for(var x = 0; x < this.foundations.length; x++ ){
	        if(this.foundations[x].length == 0 && card.value == 1){
	        	var next_slot = this.foundations[x]; 
	            this.move(1, current_slot, next_slot);
	            return true;
	        } 
	    }
	   
	    for(var y = 0; y < this.foundations.length; y++ ){
	    	next_slot = this.foundations[y];
	    	if(this.foundations[y].length > 0){
		        var other_card = last_card(next_slot);
		        if(other_card.suit == card.suit && other_card.value + 1 == card.value){
		            this.move(1, current_slot, next_slot);
		            return true;
		        }    
	    	}
	    }
	    return false;
	};
	
	Board.prototype.place_in_cascades = function(section, column, card_index){
		var stack = 1;
		var current_slot = section[column];
		var card = current_slot[card_index];  
		var selected_cards = current_slot.length - card_index; 
		// console.log('selected_cards: '+selected_cards);
		if(card != last_card(current_slot)){
			var current_card = card;
			var next_card_index = card_index + 1;
			var next_card = current_slot[next_card_index]; 
			for(var i = 0; i < selected_cards; i++){  
				if(selected_cards > this.space){console.log('not enough sapce');stack = 0;break;}
				if(next_card.color != current_card.color && next_card.value + 1 == current_card.value){
					console.log(next_card);
					if(next_card == last_card(current_slot)){
						// console.log('success');
						stack = selected_cards;
						break;
					}      
			    	current_card = next_card;
					next_card_index+=1;
					next_card = current_slot[next_card_index]; 
			    }else{
			    	// console.log('failed');
			    	stack = 0;break;
			    } 
			    // console.log('inconclusive');
			}
		}
		// console.log(stack);
        for(var x = 0; x < this.cascades.length; x++ ){
           	var next_slot = this.cascades[x];
           	if(next_slot[x] == current_slot){continue;}
           	else if(next_slot.length == 0){continue;}
           	else{
            	var other_card = last_card(next_slot);
		        if(other_card.color != card.color && other_card.value - 1 == card.value){
		            this.move(stack, current_slot, this.temp);
            		this.move(stack, this.temp, next_slot); 
		            return true;
		        }  
            }   
	    }
	    
	    for(x = 0; x < this.cascades.length; x++ ){
            next_slot = this.cascades[x];
           	if(next_slot[x] == current_slot){continue;}
            else if(next_slot.length == 0){ 
            	this.move(stack, current_slot, this.temp);
            	this.move(stack, this.temp, next_slot); 
	            return true;
            } 
	    }
	    return false;
	};
	 
	Board.prototype.place_in_freecells = function(section, column, card_index){
		var current_slot = section[column]; 
		var card = current_slot[card_index]; 
		if(card != last_card(current_slot)){return false;}
		for(var x = 0; x < this.freecells.length; x++ ){
			var next_slot = this.freecells[x];
		    if(next_slot.length == 0){  
		    	this.move(1, current_slot, next_slot);  
		    	return true; 
		    }
		}
		return false; 
	};
	
	Board.prototype.render = function(){
		this.render_stack(this.foundations, 'foundation');
		this.render_cascades();
		this.render_stack(this.freecells, 'freecell');
	};
	  
	Board.prototype.render_stack = function(stack, type){
		for(var x = 0; x < stack.length; x++){
			var column = document.getElementById(type+x); 
			for(var y = 0; y < stack[x].length; y++){
				stack[x][y].gui.style.top = 52+'px'; 
				stack[x][y].gui.id = type+x+','+y;
				column.appendChild(stack[x][y].gui);
				if(this.win){
					stack[x][y].gui.setAttribute('onclick', '');		
				}
			}
		}
	};
	
	Board.prototype.render_cascades = function(){ 
		for(var x = 0; x < this.cascades.length; x++){
			var stack = 0;
			var column = document.getElementById('cascade'+x); 
			for(var y = 0; y < this.cascades[x].length; y++){ 
				this.cascades[x][y].gui.style.top = stack+'px';
				this.cascades[x][y].gui.id = 'cascade'+x+','+y;
				column.appendChild(this.cascades[x][y].gui);
				stack+=20;
			}
		}
	};
	  
	function Deck(){
		this.CARDS = 52;
		this.suits = ["Spades", "Hearts", "Clubs", "Diamonds"];
		this.cards = []; 
		this.createGUI();
		this.create(); 
	}
	 
	
	Deck.prototype.createGUI = function(){
		this.gui = document.createElement('div');
		this.gui.className = 'deck';
	};
	
	Deck.prototype.create = function(){
		for(var i = 0; i < this.suits.length; i++){
			this.create_cards(this.suits[i]);
		} 
	};
	
	Deck.prototype.create_cards = function(suit){ 
		for(var a = 1; a < (this.CARDS/this.suits.length)+1; a++){ 
			var card = new Card(a, suit);  
			this.gui.appendChild(card.gui);
			this.cards.push(card); 
		} 
	};
	  
	function Card(value, suit){
		this.name = value.toString();
		this.suit;
		this.color;  
		this.value = value; 
		this.assign(value, suit); 
		this.createGUI();
	}	 	
	
	Card.prototype.assign = function(value, suit){
		switch(value){
			case 1: this.name = "A";break;
			case 11:this.name = "J";break;
			case 12:this.name = "Q";break;
			case 13:this.name = "K";break;
			default:break;
		}
		switch(suit){
			case "Spades":   this.color = "Black"; this.suit = "&spades;";break;
			case "Clubs":    this.color = "Black"; this.suit = "&clubs;";break;
			case "Hearts":   this.color = "Red"; this.suit = "&hearts;";break;
			case "Diamonds": this.color = "Red"; this.suit = "&diams;";break;
			default:break;
		}
	}; 
	
	Card.prototype.createGUI = function(){
		this.gui = document.createElement('div');
		this.front = document.createElement('div');
		this.label = document.createElement('div');
		this.symbol = document.createElement('div');
		this.back = document.createElement('div');
		
		this.gui.className = 'card ui-widget-content';
		this.front.className = 'front';
		this.label.className = 'card_label';
		this.symbol.className = 'card_symbol';
		this.back.className = 'back';
		
		this.label.innerHTML = this.name + ' ' + this.suit;
		this.symbol.innerHTML = this.suit;
		this.front.style.color = this.color;
		
		this.front.appendChild(this.label);
		this.front.appendChild(this.symbol);
		this.gui.appendChild(this.front);
		this.gui.appendChild(this.back);
	};
	
	var last_card = function(array){
		return array[array.length - 1];	
	};
	
	var board = new Board(); 
	 
	// $(function() { 
		// for(var x = 0; x < board.cascades.length; x++){
		// 	$( "#cascade"+x ).children().draggable({ stack: "#cascade"+x+" div" });	
		// }
  	// }); 
