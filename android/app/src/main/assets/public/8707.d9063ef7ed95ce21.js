"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[8707],{8707:(x,m,l)=>{l.r(m),l.d(m,{CarritoPageModule:()=>O});var c=l(1660),g=l(177),_=l(4341),r=l(4742),d=l(70),u=l(467),t=l(4438),P=l(6868),h=l(3656);function C(i,a){if(1&i){const o=t.RV6();t.j41(0,"ion-item",18)(1,"ion-thumbnail",0),t.nrm(2,"img",19),t.k0s(),t.j41(3,"ion-label")(4,"h2"),t.EFF(5),t.k0s(),t.j41(6,"p"),t.EFF(7),t.k0s(),t.j41(8,"p"),t.EFF(9),t.k0s(),t.j41(10,"p",20),t.EFF(11),t.k0s()(),t.j41(12,"div",21)(13,"div",22)(14,"ion-button",23),t.bIt("click",function(){const e=t.eBV(o).$implicit,s=t.XpG(2);return t.Njj(s.decreaseQuantity(e))}),t.EFF(15,"-"),t.k0s(),t.j41(16,"span"),t.EFF(17),t.k0s(),t.j41(18,"ion-button",23),t.bIt("click",function(){const e=t.eBV(o).$implicit,s=t.XpG(2);return t.Njj(s.increaseQuantity(e))}),t.EFF(19,"+"),t.k0s()(),t.j41(20,"ion-button",24),t.bIt("click",function(){const e=t.eBV(o).$implicit,s=t.XpG(2);return t.Njj(s.removeFromCart(e))}),t.nrm(21,"ion-icon",25),t.k0s(),t.j41(22,"div",26),t.EFF(23),t.nI1(24,"number"),t.k0s()()()}if(2&i){const o=a.$implicit;t.R7$(2),t.Y8G("src",o.imagen_url,t.B4B),t.R7$(3),t.JRh(o.nombre),t.R7$(2),t.SpI("Color: ",o.color,""),t.R7$(2),t.SpI("Talla: ",o.tallas,""),t.R7$(2),t.JRh(o.descripcion),t.R7$(6),t.JRh(o.quantity||1),t.R7$(6),t.SpI(" S/ ",t.i5U(24,7,o.precio*(o.quantity||1),"1.2-2")," ")}}function f(i,a){if(1&i){const o=t.RV6();t.qex(0),t.j41(1,"ion-list"),t.DNE(2,C,25,10,"ion-item",13),t.k0s(),t.j41(3,"div",14)(4,"ion-text"),t.EFF(5,"Total"),t.k0s(),t.j41(6,"ion-text",15),t.EFF(7),t.nI1(8,"number"),t.k0s()(),t.j41(9,"div",16)(10,"ion-button",17),t.bIt("click",function(){t.eBV(o);const e=t.XpG();return t.Njj(e.showPaymentOptions())}),t.EFF(11," Proceder al pago "),t.k0s()(),t.bVm()}if(2&i){const o=t.XpG();t.R7$(2),t.Y8G("ngForOf",o.cartItems),t.R7$(5),t.SpI(" S/ ",t.i5U(8,2,o.total,"1.2-2")," ")}}function y(i,a){1&i&&(t.j41(0,"div",27),t.nrm(1,"ion-icon",28),t.j41(2,"h2"),t.EFF(3,"Tu carrito est\xe1 vac\xedo"),t.k0s(),t.j41(4,"p"),t.EFF(5,"\xa1Agrega productos para comenzar!"),t.k0s(),t.j41(6,"ion-button",29),t.EFF(7," Ir a comprar "),t.k0s()())}const M=[{path:"",component:(()=>{var i;class a{constructor(n,e,s,p){(0,c.A)(this,"cartService",void 0),(0,c.A)(this,"navCtrl",void 0),(0,c.A)(this,"alertController",void 0),(0,c.A)(this,"toastController",void 0),(0,c.A)(this,"cartItems",[]),(0,c.A)(this,"total",0),(0,c.A)(this,"showPaymentModal",!1),(0,c.A)(this,"selectedPayment",""),this.cartService=n,this.navCtrl=e,this.alertController=s,this.toastController=p}ngOnInit(){this.cartItems=this.cartService.getItems(),this.updateTotal()}updateTotal(){this.total=this.cartItems.reduce((n,e)=>n+e.precio*(e.quantity||1),0)}decreaseQuantity(n){n.quantity&&n.quantity>1&&(n.quantity--,this.updateTotal())}increaseQuantity(n){n.quantity||(n.quantity=1),n.quantity++,this.updateTotal()}removeFromCart(n){this.cartService.removeItem(n),this.cartItems=this.cartService.getItems(),this.updateTotal()}showPaymentOptions(){0!==this.cartItems.length?this.showPaymentModal=!0:this.presentToast("Agrega productos al carrito para continuar")}closePaymentModal(){this.showPaymentModal=!1,this.selectedPayment=""}processPayment(){var n=this;return(0,u.A)(function*(){try{if(!n.selectedPayment)return void(yield(yield n.alertController.create({header:"Error",message:"Por favor, seleccione un m\xe9todo de pago",buttons:["OK"]})).present());const e={cartItems:n.cartItems.map(p=>({nombre:p.nombre,color:p.color,tallas:p.tallas,precio:p.precio,quantity:p.quantity||1})),total:n.total};console.log("Guardando datos para el vaucher:",e),n.cartService.setVaucherData(e),yield(yield n.alertController.create({header:"Pago Exitoso",message:`Su pago con ${n.selectedPayment.toUpperCase()} se ha realizado correctamente`,buttons:[{text:"Ver Voucher",handler:()=>{window.location.href="/vaucher"}}],backdropDismiss:!1})).present()}catch(e){console.error("Error en processPayment:",e),yield(yield n.alertController.create({header:"Error",message:"Hubo un problema al procesar el pago. Por favor, intente nuevamente.",buttons:["OK"]})).present()}})()}validateCart(){return this.cartItems.length>0&&this.total>0}presentToast(n){var e=this;return(0,u.A)(function*(){(yield e.toastController.create({message:n,duration:2e3,position:"bottom",color:"warning"})).present()})()}}return i=a,(0,c.A)(a,"\u0275fac",function(n){return new(n||i)(t.rXU(P.m),t.rXU(h.q9),t.rXU(r.hG),t.rXU(r.K_))}),(0,c.A)(a,"\u0275cmp",t.VBU({type:i,selectors:[["app-carrito"]],decls:30,vars:11,consts:[["slot","start"],["text","","defaultHref","/home"],[4,"ngIf"],["class","empty-cart",4,"ngIf"],[1,"payment-modal"],[1,"modal-content"],[1,"payment-options"],[1,"payment-option",3,"click"],["src","https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png","alt","Visa"],["src","https://play-lh.googleusercontent.com/y5S3ZIz-ohg3FirlISnk3ca2yQ6cd825OpA0YK9qklc5W8MLSe0NEIEqoV-pZDvO0A8","alt","Yape"],["src","https://play-lh.googleusercontent.com/ZsRXxnAaNfWkGh0znnApV1d2BnTysMJVgZSAG5i4xX5c3weg6C0IGr6rtkqWMrXZriA","alt","BBVA"],["expand","block",3,"click","disabled"],["expand","block","fill","clear",3,"click"],["lines","full",4,"ngFor","ngForOf"],[1,"total-section"],[1,"total-price"],[1,"checkout-button"],["expand","block",3,"click"],["lines","full"],[3,"src"],[1,"description"],[1,"item-end"],[1,"quantity-controls"],["fill","clear",3,"click"],["fill","clear","color","danger",1,"trash-button",3,"click"],["name","trash-outline"],[1,"price"],[1,"empty-cart"],["name","cart-outline","size","large"],["expand","block","routerLink","/home",1,"shop-button"]],template:function(n,e){1&n&&(t.j41(0,"ion-header")(1,"ion-toolbar")(2,"ion-buttons",0),t.nrm(3,"ion-back-button",1),t.k0s(),t.j41(4,"ion-title"),t.EFF(5,"Mi Carrito"),t.k0s()()(),t.j41(6,"ion-content"),t.DNE(7,f,12,5,"ng-container",2)(8,y,8,0,"div",3),t.j41(9,"div",4)(10,"div",5)(11,"h2"),t.EFF(12,"M\xe9todos de Pago"),t.k0s(),t.j41(13,"div",6)(14,"div",7),t.bIt("click",function(){return e.selectedPayment="visa"}),t.nrm(15,"img",8),t.j41(16,"span"),t.EFF(17,"Visa"),t.k0s()(),t.j41(18,"div",7),t.bIt("click",function(){return e.selectedPayment="yape"}),t.nrm(19,"img",9),t.j41(20,"span"),t.EFF(21,"Yape"),t.k0s()(),t.j41(22,"div",7),t.bIt("click",function(){return e.selectedPayment="bbva"}),t.nrm(23,"img",10),t.j41(24,"span"),t.EFF(25,"BBVA"),t.k0s()()(),t.j41(26,"ion-button",11),t.bIt("click",function(){return e.processPayment()}),t.EFF(27," Pagar "),t.k0s(),t.j41(28,"ion-button",12),t.bIt("click",function(){return e.closePaymentModal()}),t.EFF(29," Cerrar "),t.k0s()()()()),2&n&&(t.R7$(7),t.Y8G("ngIf",e.cartItems.length>0),t.R7$(),t.Y8G("ngIf",0===e.cartItems.length),t.R7$(),t.AVh("show-modal",e.showPaymentModal&&e.cartItems.length>0),t.R7$(5),t.AVh("selected","visa"===e.selectedPayment),t.R7$(4),t.AVh("selected","yape"===e.selectedPayment),t.R7$(4),t.AVh("selected","bbva"===e.selectedPayment),t.R7$(4),t.Y8G("disabled",!e.selectedPayment))},dependencies:[g.Sq,g.bT,r.Jm,r.QW,r.W9,r.eU,r.iq,r.uz,r.he,r.nf,r.IO,r.Zx,r.BC,r.ai,r.el,r.N7,d.Wk,g.QX],styles:["ion-header[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%]{--background: #ffffff}ion-header[_ngcontent-%COMP%]   ion-back-button[_ngcontent-%COMP%]{--color: #0d47a1}ion-content[_ngcontent-%COMP%]{--background: #ffffff}ion-item[_ngcontent-%COMP%]{--padding-start: 16px;--padding-end: 16px;--inner-padding-end: 0;margin-bottom:8px}ion-item[_ngcontent-%COMP%]   ion-thumbnail[_ngcontent-%COMP%]{--size: 80px;margin-right:16px}ion-item[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:16px;font-weight:500;margin-bottom:4px}ion-item[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#666;font-size:14px;margin:2px 0}.item-end[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:flex-end;gap:8px}.quantity-controls[_ngcontent-%COMP%]{display:flex;align-items:center;border:1px solid #ddd;border-radius:4px}.quantity-controls[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]{--padding-start: 8px;--padding-end: 8px;--color: #666;margin:0;height:30px}.quantity-controls[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{min-width:30px;text-align:center;font-size:14px}.trash-button[_ngcontent-%COMP%]{--padding-start: 4px;--padding-end: 4px;height:30px;margin:0}.price[_ngcontent-%COMP%]{color:#0d47a1;font-weight:500;font-size:16px}.total-section[_ngcontent-%COMP%]{padding:16px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #eee;margin-top:16px}.total-section[_ngcontent-%COMP%]   .total-price[_ngcontent-%COMP%]{font-weight:700;font-size:18px;color:#0d47a1}.checkout-button[_ngcontent-%COMP%]{padding:16px}.checkout-button[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]{--background: #0d47a1;margin:0;height:44px;font-weight:500;text-transform:none}.description[_ngcontent-%COMP%]{color:#999;font-size:12px}.payment-modal[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;display:none;justify-content:center;align-items:center;z-index:1000}.payment-modal.show-modal[_ngcontent-%COMP%]{display:flex}.payment-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]{background:#fff;padding:20px;border-radius:10px;width:90%;max-width:400px}.payment-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{text-align:center;margin-bottom:20px}.payment-modal[_ngcontent-%COMP%]   .payment-options[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-bottom:20px}.payment-modal[_ngcontent-%COMP%]   .payment-options[_ngcontent-%COMP%]   .payment-option[_ngcontent-%COMP%]{text-align:center;padding:10px;border:1px solid #ddd;border-radius:8px;cursor:pointer}.payment-modal[_ngcontent-%COMP%]   .payment-options[_ngcontent-%COMP%]   .payment-option[_ngcontent-%COMP%]:hover{background:#f5f5f5}.payment-modal[_ngcontent-%COMP%]   .payment-options[_ngcontent-%COMP%]   .payment-option.selected[_ngcontent-%COMP%]{background-color:var(--ion-color-primary-tint);border-color:var(--ion-color-primary)}.payment-modal[_ngcontent-%COMP%]   .payment-options[_ngcontent-%COMP%]   .payment-option[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:50px;height:50px;object-fit:contain;margin-bottom:8px}.payment-modal[_ngcontent-%COMP%]   .payment-options[_ngcontent-%COMP%]   .payment-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;font-size:14px}[_nghost-%COMP%]   .success-message[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;padding:20px;text-align:center}[_nghost-%COMP%]   .success-message[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:64px;color:#2dd36f;margin-bottom:15px}[_nghost-%COMP%]   .success-message[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0}  .success-alert .alert-wrapper .alert-head{text-align:center}  .success-alert .alert-wrapper .alert-message{text-align:center}ion-icon[name=cart][_ngcontent-%COMP%], ion-icon[name=cart-outline][_ngcontent-%COMP%]{font-size:40px;min-width:32px;min-height:32px}ion-button[_ngcontent-%COMP%]   ion-icon[name=cart][_ngcontent-%COMP%], ion-button[_ngcontent-%COMP%]   ion-icon[name=cart-outline][_ngcontent-%COMP%]{font-size:38px;min-width:32px;min-height:32px}.cart-counter[_ngcontent-%COMP%]{background-color:var(--ion-color-danger, #eb445a);color:#fff;border-radius:50%;width:28px;height:28px;display:flex;justify-content:center;align-items:center;font-size:30px;position:absolute;top:-5px;right:-5px}.custom-alert[_ngcontent-%COMP%]   .alert-wrapper[_ngcontent-%COMP%]{background:#fff;border-radius:15px}.custom-alert[_ngcontent-%COMP%]   .alert-head[_ngcontent-%COMP%]{color:#2dd36f;text-align:center}.custom-alert[_ngcontent-%COMP%]   .alert-button[_ngcontent-%COMP%]{color:#3880ff;font-weight:700}.empty-cart[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:20px;text-align:center}.empty-cart[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:80px;color:var(--ion-color-medium);margin-bottom:20px}.empty-cart[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:24px;margin-bottom:10px;color:var(--ion-color-dark)}.empty-cart[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--ion-color-medium);margin-bottom:30px}.empty-cart[_ngcontent-%COMP%]   .shop-button[_ngcontent-%COMP%]{max-width:200px;margin:0 auto}"]})),a})()}];let b=(()=>{var i;class a{}return i=a,(0,c.A)(a,"\u0275fac",function(n){return new(n||i)}),(0,c.A)(a,"\u0275mod",t.$C({type:i})),(0,c.A)(a,"\u0275inj",t.G2t({imports:[d.iI.forChild(M),d.iI]})),a})(),O=(()=>{var i;class a{}return i=a,(0,c.A)(a,"\u0275fac",function(n){return new(n||i)}),(0,c.A)(a,"\u0275mod",t.$C({type:i})),(0,c.A)(a,"\u0275inj",t.G2t({imports:[g.MD,_.YN,r.bv,b]})),a})()}}]);