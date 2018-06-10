let options = {
	httpEndpoint: 'http://192.168.43.240:8888',
	//httpEndpoint: 'http://91.201.41.253:8888',
	debug: false,
	keyProvider: '5JpNgFavmjG1Jp6m2hjpMFXF4Mhzpe8Bt2TzBy1dZjH3gFbE5jK',
	//authorization: 'alice@active',
	sign: true,
	//broadcast: true
};
var eos = Eos(options);

/* eos.getInfo((err, info) => {
	console.log(err, info);
}); */

eos.getCode({ account_name: 'beesocial' }, (err, res) => {
	if ( ! err) {
		console.log('smartcontract', res.abi);
	}
	else console.error(err);
});

let $loader = document.getElementsByClassName('lding')[0];
let loadingShow = () => {
	$loader.style.display = 'block';
};
let loadingHide = () => {
	$loader.style.display = 'none';
};

/* let resourceItemSelected;
let $resourcesPage = document.querySelector('#resources-page');
let $resources = $resourcesPage.querySelector('#resources');
let $resourceItem = document.querySelector('#resource-item'); */

let getResources = () => {
	eos.getTableRows({
		scope: 'beesocial',
		code: 'beesocial',
		table: 'resources',
		json: true
	}, (err, res) => {
		if ( ! err) {
			console.log(res);
			res.rows.forEach(item => {
				console.log('resource', item);
				
				let $newItem = $resourceItem.cloneNode(true);
				$newItem.querySelector('.card-title').innerHTML = item.title;
				$newItem.querySelector('.card-text').innerHTML = item.description;
				$newItem.setAttribute('data-id', item.id);
				$newItem.querySelector('button').addEventListener('click', () => {
					resourceItemSelected = item;
					$resourceModal.querySelector('#resource-title').innerHTML = item.title;
					$resourceModal.querySelector('#resource-description').innerHTML = item.description;
					$resourceModal.querySelector('#resource-how-get').innerHTML = item.how_get;
					$resourceModal.querySelector('#resource-contacts').innerHTML = item.contacts;
					$resourceModal.querySelector('#resource-combs').innerHTML = item.price;
					resourceModal.show();
				});
				$newItem.style.display = 'block';
				$resources.appendChild($newItem);
				
			});
		}
		else console.error(err);
	});
};
getResources();

let getWorkersTable = () => {
	eos.getTableRows({
		scope: 'beesocial',
		code: 'beesocial',
		table: 'workers',
		json: true
	}, (err, res) => {
		if ( ! err) {
			res.rows.forEach(item => {
				console.log('item', item);
				
				/* let $newItem = $resourceItem.cloneNode(true);
				$newItem.querySelector('.card-title').innerHTML = item.title;
				$newItem.querySelector('.card-text').innerHTML = item.description;
				$newItem.setAttribute('data-id', item.id);
				$newItem.querySelector('button').addEventListener('click', () => {
					resourceItemSelected = item;
					$resourceModal.querySelector('#resource-title').innerHTML = item.title;
					$resourceModal.querySelector('#resource-description').innerHTML = item.description;
					$resourceModal.querySelector('#resource-how-get').innerHTML = item.howget;
					$resourceModal.querySelector('#resource-contacts').innerHTML = item.contacts;
					$resourceModal.querySelector('#resource-price').innerHTML = item.price;
					resourceModal.show();
				});
				$newItem.style.display = 'block';
				$resources.appendChild($newItem); */
				
			});
		}
		else console.error(err);
	});
};
getWorkersTable();

let $login = document.getElementById('login');
let $logout = document.getElementById('logout');

let callbackAuth;
let username = 'beesocial';
let wif = '5JpNgFavmjG1Jp6m2hjpMFXF4Mhzpe8Bt2TzBy1dZjH3gFbE5jK';

document.getElementById('form-login-pass').addEventListener('submit', e => {
	e.preventDefault();
	let log = document.getElementById('logged').checked,
		user = document.getElementById('input-user').value,
		pass = document.getElementById('input-pass').value;
	username = user;
	wif = pass;
	log ? localStorage.username = username : '';
	log ? localStorage.wif = JSON.stringify(wif) : {};
	$login.style.display = 'none';
	$logout.style.display = 'inline-block';
	modalAuth.hide();
	if (callbackAuth) callbackAuth();
});

let auth = (callback) => {
	if (wif && username) callback();
	else {
		modalAuth.show();
		callbackAuth = callback;
	}
};

//
$login.addEventListener('click', () => {
	modalAuth.show();
});

let $createResourceModalForm = $createResourceModal.querySelector('form');
$createResourceModalForm.addEventListener('submit', e => {
	e.preventDefault();
	let title = this['title-resource'].value,
		combs = this['combs-resource'].value,
		howGet = this['how-get-resource'].value,
		description = this['description-resource'].value,
		contacts = this['contacts-resource'].value,
		author = username;
	auth(() => {
		loadingShow();
		eos.transaction('beesocial', (operation) => {
			operation.resource(author, title, 1, 1, description, howGet, contacts, combs + ' SOCIAL', {authorization: author}); // alice@active
			loadingHide();
			$createResourceModalForm.reset();
			createResourceModal.hide();
			//window.location.hash = '#resources/' + id;
		});
	});
});