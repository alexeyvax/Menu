import RenderOnPage from './RenderOnPage';

/**
 * Класс Store
 *
 * @method onChange сообщает нужному подписчику об изменениях в поле ввода
 * @method restore сообщает нужному подписчику об изменениях видимости поля
 * @method add сообщает нужному подписчику о добавлении нового пункта
 */

class Store
{
	constructor()
	{
		this.store = [];
		this.renderOnPage = new RenderOnPage();
	}

	onChange( item, value )
	{
		const index = this.store.indexOf( item )
		
		this.renderOnPage.change( index, value );
	}

	restore( item, isRestore )
	{
		const index = this.store.indexOf( item )
		
		if ( isRestore )
		{
			this.renderOnPage.hide( index );
		}
		else
		{
			this.renderOnPage.show( index );
		}
	}

	add( item )
	{
		this.store.push( item );
		
		this.renderOnPage.add( item );
	}
}

export {
	Store as default,
}
