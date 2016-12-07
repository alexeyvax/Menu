/** Класс скрытия пункта меню */
const CLASS_HIDE = 'hide';

/**
 * Класс RenderOnPage
 *
 * @method onChange сообщает нужному подписчику об изменениях в поле ввода
 * @method restore сообщает нужному подписчику об изменениях видимости поля
 * @method add сообщает нужному подписчику о добавлении нового пункта
 */

class RenderOnPage
{
	constructor()
	{
		this.renderStore = [];
		this.itemsContainer = document.getElementById( 'list-items' );
	}
	
	add( item )
	{
		const newItem = this.createElement();
		
		this.renderStore.push( newItem );
		this.itemsContainer.appendChild( newItem );
	}
	
	hide( index )
	{
		this.renderStore[index].classList.add( CLASS_HIDE );
	}
	
	show( index )
	{
		this.renderStore[index].classList.remove( CLASS_HIDE );
	}
	
	change( index, value )
	{
		const item = this.renderStore[index];
		
		if ( item.classList.contains( CLASS_HIDE ) )
		{
			item.classList.remove( CLASS_HIDE );
		}
		
		item.textContent = value;
	}
	
	createElement()
	{
		const container = document.createElement( 'li' );
		container.classList.add( CLASS_HIDE );
		
		return container;
	}
}

export {
	RenderOnPage as default,
}
