(function () {
  'use strict';

  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /** Класс скрытия пункта меню */
  var CLASS_HIDE = 'hide';

  /**
   * Класс RenderOnPage
   *
   * @method onChange сообщает нужному подписчику об изменениях в поле ввода
   * @method restore сообщает нужному подписчику об изменениях видимости поля
   * @method add сообщает нужному подписчику о добавлении нового пункта
   */

  var RenderOnPage = function () {
  	function RenderOnPage() {
  		classCallCheck(this, RenderOnPage);

  		this.renderStore = [];
  		this.itemsContainer = document.getElementById('list-items');
  	}

  	createClass(RenderOnPage, [{
  		key: 'add',
  		value: function add(item) {
  			var newItem = this.createElement();

  			this.renderStore.push(newItem);
  			this.itemsContainer.appendChild(newItem);
  		}
  	}, {
  		key: 'hide',
  		value: function hide(index) {
  			this.renderStore[index].classList.add(CLASS_HIDE);
  		}
  	}, {
  		key: 'show',
  		value: function show(index) {
  			this.renderStore[index].classList.remove(CLASS_HIDE);
  		}
  	}, {
  		key: 'change',
  		value: function change(index, value) {
  			var item = this.renderStore[index];

  			if (item.classList.contains(CLASS_HIDE)) {
  				item.classList.remove(CLASS_HIDE);
  			}

  			item.textContent = value;
  		}
  	}, {
  		key: 'createElement',
  		value: function createElement() {
  			var container = document.createElement('li');
  			container.classList.add(CLASS_HIDE);

  			return container;
  		}
  	}]);
  	return RenderOnPage;
  }();

  /**
   * Класс Store
   *
   * @method onChange сообщает нужному подписчику об изменениях в поле ввода
   * @method restore сообщает нужному подписчику об изменениях видимости поля
   * @method add сообщает нужному подписчику о добавлении нового пункта
   */

  var Store = function () {
  	function Store() {
  		classCallCheck(this, Store);

  		this.store = [];
  		this.renderOnPage = new RenderOnPage();
  	}

  	createClass(Store, [{
  		key: 'onChange',
  		value: function onChange(item, value) {
  			var index = this.store.indexOf(item);

  			this.renderOnPage.change(index, value);
  		}
  	}, {
  		key: 'restore',
  		value: function restore(item, isRestore) {
  			var index = this.store.indexOf(item);

  			if (isRestore) {
  				this.renderOnPage.hide(index);
  			} else {
  				this.renderOnPage.show(index);
  			}
  		}
  	}, {
  		key: 'add',
  		value: function add(item) {
  			this.store.push(item);

  			this.renderOnPage.add(item);
  		}
  	}]);
  	return Store;
  }();

  /** Класс изменения видимости пункта меню */
  var CLASS_RESTORE = 'restore';

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

  var Menu = function () {
  	function Menu(menu) {
  		var _this = this;

  		classCallCheck(this, Menu);

  		this.menu = menu;
  		this.count = 1;
  		this.buttonAdd = menu.querySelector('div.items-container>button.addNewItem');
  		this.itemsContainer = menu.querySelector('div.items-container>ul.items');

  		this.store = new Store();

  		this.buttonAdd.addEventListener('click', function () {
  			return _this.addItem();
  		});
  		this.itemsContainer.addEventListener('click', function (event) {
  			return _this.restoreItem(event);
  		});
  		this.itemsContainer.addEventListener('input', function (event) {
  			return _this.changeContent(event);
  		});
  	}

  	createClass(Menu, [{
  		key: 'addItem',
  		value: function addItem() {
  			var newItem = this.createElement();

  			this.store.add(newItem);
  			this.itemsContainer.appendChild(newItem);
  		}
  	}, {
  		key: 'restoreItem',
  		value: function restoreItem(event) {
  			if (event.target.tagName === 'BUTTON') {
  				var button = event.target;
  				var element = button.parentElement;

  				if (!element.classList.contains(CLASS_RESTORE)) {
  					element.classList.add(CLASS_RESTORE);
  					button.textContent = 'restore';
  					this.store.restore(element, true);
  				} else {
  					element.classList.remove(CLASS_RESTORE);
  					button.textContent = 'remove';
  					this.store.restore(element, false);
  				}
  			}
  		}
  	}, {
  		key: 'changeContent',
  		value: function changeContent(event) {
  			var item = event.target.parentElement;
  			var textarea = item.querySelector('textarea');

  			this.store.onChange(item, textarea.value);
  		}
  	}, {
  		key: 'createElement',
  		value: function createElement() {
  			var container = document.createElement('li');
  			var label = document.createElement('label');
  			var textarea = document.createElement('textarea');
  			var button = document.createElement('button');

  			label.textContent = 'item #' + this.count++;
  			button.textContent = 'Remove';

  			container.appendChild(label);
  			container.appendChild(textarea);
  			container.appendChild(button);

  			return container;
  		}
  	}]);
  	return Menu;
  }();

  /** Класс видимости выпадающего меню */
  var CLASS_OPEN_MENU = 'open';

  /**
   * init функция инициализации
   */
  function init() {
  	var app = document.querySelector('section.app');
  	var buttonOpen = app.querySelector('button.open');
  	var menu = app.querySelector('aside.side-bar');
  	var buttonClose = app.querySelector('aside.side-bar>button.close');

  	registerHandlers(buttonOpen, buttonClose, menu);
  }

  /**
   * registerHandlers функция регистрации обработчиков
   * 
   * @params buttonOpen кнопка открытия меню
   * @params buttonClose кнопка закрытия меню
   * @params menu выпадающее меню
   */
  function registerHandlers(buttonOpen, buttonClose, menu) {
  	buttonOpen.addEventListener('click', function () {
  		return toogleClassMenu(true, menu);
  	});
  	buttonClose.addEventListener('click', function () {
  		return toogleClassMenu(false, menu);
  	});

  	new Menu(menu);
  }

  /**
   * toogleClassMenu функция видимости выпадающего меню
   * 
   * @params isOpenMenu открыто ли меню
   * @params menu выпадающее меню
   */
  function toogleClassMenu(isOpenMenu, menu) {
  	if (isOpenMenu) {
  		menu.classList.add(CLASS_OPEN_MENU);
  	} else {
  		menu.classList.remove(CLASS_OPEN_MENU);
  	}
  }

  init();

}());
//# sourceMappingURL=index.js.map
