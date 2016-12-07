import Menu from '../classes/Menu';

/** Класс видимости выпадающего меню */
const CLASS_OPEN_MENU = 'open';

/**
 * init функция инициализации
 */
function init()
{
	const app = document.querySelector( 'section.app' );
	const buttonOpen = app.querySelector( 'button.open' );
	const menu = app.querySelector( 'aside.side-bar' );
	const buttonClose = app.querySelector( 'aside.side-bar>button.close' );
	
	registerHandlers( buttonOpen, buttonClose, menu );
}

/**
 * registerHandlers функция регистрации обработчиков
 * 
 * @params buttonOpen кнопка открытия меню
 * @params buttonClose кнопка закрытия меню
 * @params menu выпадающее меню
 */
function registerHandlers( buttonOpen, buttonClose, menu )
{
	buttonOpen.addEventListener( 'click', () => toogleClassMenu( true, menu ) );
	buttonClose.addEventListener( 'click', () => toogleClassMenu( false, menu ) );
	
	new Menu( menu );
}

/**
 * toogleClassMenu функция видимости выпадающего меню
 * 
 * @params isOpenMenu открыто ли меню
 * @params menu выпадающее меню
 */
function toogleClassMenu( isOpenMenu, menu )
{
	if ( isOpenMenu )
	{
		menu.classList.add( CLASS_OPEN_MENU );
	}
	else
	{
		menu.classList.remove( CLASS_OPEN_MENU );
	}
}

export {
	init as default,
}
