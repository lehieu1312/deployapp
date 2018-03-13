import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TextInput, NavController } from 'ionic-angular';

// Custom
import { Core } from '../../service/core.service';
import { Storage } from '@ionic/storage';

//Pipes
import { ObjectToArray } from '../../pipes/object-to-array';

// Page
import { DetailPage } from '../detail/detail';
import { CategoriesPage } from '../categories/categories';
import { AccountPage } from '../account/account';

declare var wordpress_url: string;
declare var wordpress_per_page: Number;

@Component({
	selector: 'page-search',
	templateUrl: 'search.html',
	providers: [Core, ObjectToArray]
})
export class SearchPage {
	@ViewChild(TextInput) inputSearch: TextInput;
	@ViewChild('cart') buttonCart;
	DetailPage = DetailPage;
	CategoriesPage = CategoriesPage;
	AccountPage = AccountPage;
	keyword: string;
	products: Object[] = []; attributes: Object[] = [];
	page = 1; sort: string = '-date_created_gmt'; range: Object = { lower: 0, upper: 0 };
	filter: Object = { grid: true, open: null, value: {}, valueCustom: {} }; filtering: boolean;
	grid: boolean = true;
	favorite: Object = {};
	over: boolean;
	noResuilt:boolean = false;
	data:Object[] = [];

	constructor(
		private http: Http,
		private core: Core,
		private storage: Storage,
		private navCtrl: NavController
	) {
		// this.getCart();
		http.get(wordpress_url + '/wp-json/wooconnector/product/getattribute')
		.subscribe(res => {
			this.attributes = res.json();
			this.attributes['custom'] = new ObjectToArray().transform(this.attributes['custom']);
			this.reset();
			core.hideLoading();
		});
	}
	ngOnInit() {
		if (this.inputSearch) {
			this.inputSearch["clearTextInput"] = (): void => {
				(void 0);
				this.inputSearch._value = '';
				this.inputSearch.onChange(this.inputSearch._value);
				this.inputSearch.writeValue(this.inputSearch._value);
				setTimeout(() => { this.inputSearch.setFocus(); }, 0);
			}
		}
	}
	getCart () {
		this.storage.get('cart').then(val => { if (val){ this.data = Object.assign(this.data,val); console.log(this.data); }});
	}
	ionViewDidEnter() {
		this.getCart();
		this.getFavorite();
		this.buttonCart.update();
	}
	getFavorite() {
		this.storage.get('favorite').then(val => { if (val) this.favorite = val });
	}
	reset() {
		this.filter['value'] = {};
		this.filter['valueCustom'] = {};
		this.attributes['attributes'].forEach(attr => {
			this.filter['value'][attr['slug']] = {};
		});
		this.attributes['custom'].forEach(attr => {
			this.filter['valueCustom'][attr['slug']] = {};
		});
		this.range = { lower: 0, upper: 0 };
	}
	openFilter() {
		if (this.filter['open'] == 'filter') this.filter['open'] = null;
		else this.filter['open'] = 'filter';
	}
	openSort() {
		if (this.filter['open'] == 'sort') this.filter['open'] = null;
		else this.filter['open'] = 'sort';
	}
	search() {
		if (this.filter['open'] == 'filter') this.openFilter();
		// console.log(this.inputSearch);
		this.page = 1;
		this.over = false;
		this.core.showLoading();
		this.getProducts().subscribe(products => {
			if (products && products.length > 0) {
				this.noResuilt = false;
				this.page++;
				if (this.data) {
					products.forEach(val => {
						this.data.forEach(cart => {
							if (val['id'] == cart['id']) val['onCart'] = true;
						});
					});
				} 
				this.products = products;
			} else {
				this.products = [];
				this.noResuilt = true;
			}
			this.core.hideLoading();
		});
	}
	getProducts(): Observable<Object[]> {
		// return new Observable(observable => {
		// 	let params = {
		// 		search: this.keyword,
		// 		post_num_page: this.page,
		// 		post_per_page: wordpress_per_page
		// 	};
		// 	this.http.get(wordpress_url + '/wp-json/wooconnector/product/getproduct', {
		// 		search: this.core.objectToURLParams(params)
		// 	}).subscribe(products => {
		// 		observable.next(products.json());
		// 		observable.complete();
		// 	});
		// });
		return new Observable(observable => {
			let tmpFilter = [];
			for (var filter in this.filter['value']) {
				let attr = this.filter['value'][filter];
				if (Object.keys(attr).length > 0) for (var option in attr) {
					if (attr[option]) {
						let now = {};
						now['keyattr'] = filter;
						now['valattr'] = option;
						now['type'] = 'attributes';
						tmpFilter.push(now);
					}
				};
			}
			for (var filter in this.filter['valueCustom']) {
				let attr = this.filter['value'][filter];
				if (attr && Object.keys(attr).length > 0) for (var option in attr) {
					if (attr[option]) {
						let now = {};
						now['keyattr'] = filter;
						now['valattr'] = option;
						now['type'] = 'custom';
						tmpFilter.push(now);
					}
				};
			}
			if (tmpFilter.length == 0 && !this.range['lower'] && !this.range['upper']) {
				let params = {
					search: this.keyword,
					post_num_page: this.page,
					post_per_page: wordpress_per_page
				};
				this.http.get(wordpress_url + '/wp-json/wooconnector/product/getproduct', {
					search: this.core.objectToURLParams(params)
				}).subscribe(products => {
					observable.next(products.json());
					observable.complete();
				});
			} else {
				let params = {};
				// params['post_category'] = this.id.toString();
				if (tmpFilter.length > 0) params['attribute'] = JSON.stringify(tmpFilter);
				params['search'] = this.keyword;
				params['post_num_page'] = this.page;
				params['post_per_page'] = wordpress_per_page;
				if (this.range['lower'] != 0) params['min_price'] = this.range['lower'];
				if (this.range['upper'] != 0) params['max_price'] = this.range['upper'];
				this.http.get(wordpress_url + '/wp-json/wooconnector/product/getproductbyattribute', {
					search: this.core.objectToURLParams(params)
				}).subscribe(products => {
					observable.next(products.json());
					observable.complete();
				});
			}
		});
	}
	load(infiniteScroll) {
		this.getProducts().subscribe(products => {
			if (products && products.length > 0) {
				this.page++;
				this.products = this.products.concat(products);
			} else this.over = true;
			infiniteScroll.complete();
		});
	}
	changeFavorite(product: Object) {
		if (this.favorite[product["id"]]) {
			delete this.favorite[product["id"]];
			this.storage.set('favorite', this.favorite);
		} else {
			let data: any = {
				id: product["id"],
				name: product["name"],
				regular_price: product["regular_price"],
				sale_price: product["sale_price"],
				price: product["price"],
				on_sale: product["on_sale"],
				price_html: product["price_html"],
				type: product["type"]
			};
			if (product["modernshop_images"]) data['images'] = product["modernshop_images"][0].modern_square;
			this.favorite[product["id"]] = data;
			this.storage.set('favorite', this.favorite);
		}
	}
	onSwipeContent(e) {
		if (e['deltaX'] < -150 || e['deltaX'] > 150) {
			if (e['deltaX'] < 0) this.navCtrl.push(this.AccountPage);
			else this.navCtrl.push(this.CategoriesPage);
		}
	}
}