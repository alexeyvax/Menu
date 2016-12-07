import Store from './Store';

/** Класс изменения видимости пункта меню */
const CLASS_RESTORE = 'restore';

/**
 * Класс Menu
 * 
 * @params menu выпадающее меню
 * 
 * @method addItem добавляет новый пункт
 * @method restoreItem определяет видимость поля
 * @method changeContent фиксирует изменение в поле ввода и передаёт дальше
 * @method createElement создаёт нужные html элементы для нового пункта
 */

class Menu
{
	constructor( menu )
	{
		this.menu = menu;
		this.count = 1;
		this.buttonAdd = menu.querySelector( 'div.items-container>button.addNewItem' );
		this.itemsContainer = menu.querySelector( 'div.items-container>ul.items' );
		
		this.store = new Store();
		
		this.buttonAdd.addEventListener( 'click', () => this.addItem() );
		this.itemsContainer.addEventListener( 'click', ( event ) => this.restoreItem( event ) );
		this.itemsContainer.addEventListener( 'input', ( event ) => this.changeContent( event ) );
	}
	
	addItem()
	{
		const newItem = this.createElement();
		
		this.store.add( newItem );
		this.itemsContainer.appendChild( newItem );
	}
	
	restoreItem( event )
	{
		if ( event.target.tagName === 'BUTTON' )
		{
			const button = event.target;
			const element = button.parentElement;
		
			if ( !element.classList.contains( CLASS_RESTORE ) )
			{
				element.classList.add( CLASS_RESTORE );
				button.textContent = 'restore';
				this.store.restore( element, true );
			}
			else
			{
				element.classList.remove( CLASS_RESTORE );
				button.textContent = 'remove';
				this.store.restore( element, false );
			}
		}
	}
	
	changeContent( event )
	{
		const item = event.target.parentElement;
		const textarea = item.querySelector( 'textarea' );
		
		this.store.onChange( item, textarea.value );
	}
	
	createElement()
	{
		const container = document.createElement( 'li' );
		const label = document.createElement( 'label' );
		const textarea = document.createElement( 'textarea' );
		const button = document.createElement( 'button' );
		
		label.textContent = `item #${this.count++}`;
		button.textContent = 'Remove';
		
		container.appendChild( label );
		container.appendChild( textarea );
		container.appendChild( button );
		
		return container;
	}
}

export {
	Menu as default,
}
