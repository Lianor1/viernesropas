"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[733],{733:(A,P,d)=>{d.r(P),d.d(P,{ComprasPageModule:()=>D});var l=d(1660),C=d(177),v=d(4341),e=d(4742),f=d(70),h=d(467),_=d(9107),F=d(7239),M=d.n(F),t=d(4438),O=d(8955);function b(a,r){if(1&a&&(t.j41(0,"ion-item",13)(1,"ion-label")(2,"h3"),t.EFF(3),t.k0s(),t.j41(4,"p")(5,"ion-badge",14),t.EFF(6),t.k0s(),t.j41(7,"ion-badge",14),t.EFF(8),t.k0s()(),t.j41(9,"p"),t.EFF(10),t.j41(11,"span"),t.EFF(12),t.k0s()()()()),2&a){const i=r.$implicit;t.R7$(3),t.JRh(i.producto_nombre),t.R7$(3),t.JRh(i.color),t.R7$(2),t.JRh(i.talla),t.R7$(2),t.Lme(" ",i.cantidad,"x S/ ",i.precio_unitario," "),t.R7$(2),t.SpI("S/ ",i.precio_total,"")}}function x(a,r){if(1&a){const i=t.RV6();t.j41(0,"ion-card",10),t.bIt("click",function(){const o=t.eBV(i).$implicit,c=t.XpG(2);return t.Njj(c.verDetalles(o))}),t.j41(1,"ion-card-header")(2,"ion-card-subtitle")(3,"ion-badge",11),t.EFF(4),t.k0s(),t.j41(5,"span"),t.EFF(6),t.nI1(7,"date"),t.k0s()(),t.j41(8,"ion-card-title"),t.EFF(9),t.k0s()(),t.j41(10,"ion-card-content"),t.DNE(11,b,13,6,"ion-item",12),t.k0s()()}if(2&a){const i=r.$implicit;t.R7$(4),t.SpI("Vaucher #",i.id,""),t.R7$(2),t.JRh(t.i5U(7,4,i.fecha,"dd/MM/yyyy HH:mm")),t.R7$(3),t.SpI("S/ ",i.total,""),t.R7$(2),t.Y8G("ngForOf",i.vaucher_items)}}function E(a,r){if(1&a&&(t.j41(0,"div"),t.DNE(1,x,12,7,"ion-card",9),t.k0s()),2&a){const i=t.XpG();t.R7$(),t.Y8G("ngForOf",i.vauchers)}}function j(a,r){1&a&&(t.j41(0,"div",15),t.nrm(1,"ion-icon",16),t.j41(2,"h2"),t.EFF(3,"No tienes compras realizadas"),t.k0s(),t.j41(4,"p"),t.EFF(5,"\xa1Explora nuestra tienda y encuentra productos incre\xedbles!"),t.k0s(),t.j41(6,"ion-button",17),t.EFF(7," Ir a comprar "),t.k0s()())}const k=[{path:"",component:(()=>{var a;class r{constructor(n,o,c,s,g){(0,l.A)(this,"supabase",void 0),(0,l.A)(this,"router",void 0),(0,l.A)(this,"menuCtrl",void 0),(0,l.A)(this,"loadingCtrl",void 0),(0,l.A)(this,"toastCtrl",void 0),(0,l.A)(this,"vauchers",[]),(0,l.A)(this,"filtroFecha","all"),this.supabase=n,this.router=o,this.menuCtrl=c,this.loadingCtrl=s,this.toastCtrl=g}ngOnInit(){var n=this;return(0,h.A)(function*(){yield n.cargarCompras()})()}onFiltroChange(n){var o=this;return(0,h.A)(function*(){o.filtroFecha=n.detail.value,yield o.cargarCompras()})()}logout(){var n=this;return(0,h.A)(function*(){try{yield n.supabase.logout(),yield n.menuCtrl.close(),n.router.navigate(["/login"])}catch(o){console.error("Error al cerrar sesi\xf3n:",o)}})()}cargarCompras(){var n=this;return(0,h.A)(function*(){const o=yield n.loadingCtrl.create({message:"Cargando compras..."});try{yield o.present();const c=yield n.supabase.getCurrentUser();if(!c)throw new Error("No hay usuario autenticado");let s=null;const g=(new Date).toISOString();switch(n.filtroFecha){case"today":const m=new Date;m.setHours(0,0,0,0),s=m.toISOString();break;case"week":const u=new Date;u.setDate(u.getDate()-7),s=u.toISOString();break;case"month":const p=new Date;p.setMonth(p.getMonth()-1),s=p.toISOString();break;default:s=null}n.vauchers=yield n.supabase.obtenerVauchersPorUsuarioYFecha(c.id,s,g)}catch(c){console.error("Error al cargar compras:",c)}finally{o.dismiss()}})()}downloadPDF(n,o){var c=this;return(0,h.A)(function*(){n.stopPropagation();const s=yield c.loadingCtrl.create({message:"Generando PDF..."});yield s.present();try{const g=document.getElementById(`vaucher-${o.id}`);if(!g)throw new Error("Elemento no encontrado");const m=yield M()(g),u=m.toDataURL("image/png"),p=new _.uE({orientation:"portrait",unit:"mm",format:"a4"}),y=p.internal.pageSize.getWidth();p.addImage(u,"PNG",0,0,y,m.height*y/m.width),p.save(`vaucher_${o.id}.pdf`),(yield c.toastCtrl.create({message:"PDF descargado exitosamente",duration:2e3,color:"success"})).present()}catch(g){console.error("Error al generar PDF:",g),(yield c.toastCtrl.create({message:"Error al generar el PDF",duration:2e3,color:"danger"})).present()}finally{s.dismiss()}})()}downloadImage(n,o){var c=this;return(0,h.A)(function*(){n.stopPropagation();const s=yield c.loadingCtrl.create({message:"Generando imagen..."});yield s.present();try{const g=document.getElementById(`vaucher-${o.id}`);if(!g)throw new Error("Elemento no encontrado");const m=yield M()(g),u=document.createElement("a");u.download=`vaucher_${o.id}.png`,u.href=m.toDataURL("image/png"),u.click(),(yield c.toastCtrl.create({message:"Imagen descargada exitosamente",duration:2e3,color:"success"})).present()}catch(g){console.error("Error al generar imagen:",g),(yield c.toastCtrl.create({message:"Error al generar la imagen",duration:2e3,color:"danger"})).present()}finally{s.dismiss()}})()}verDetalles(n){this.router.navigate(["/vaucher-detalle"],{state:{vaucherData:n}})}}return a=r,(0,l.A)(r,"\u0275fac",function(n){return new(n||a)(t.rXU(O.w),t.rXU(f.Ix),t.rXU(e._t),t.rXU(e.Xi),t.rXU(e.K_))}),(0,l.A)(r,"\u0275cmp",t.VBU({type:a,selectors:[["app-compras"]],decls:21,vars:3,consts:[["slot","start"],["defaultHref","/home","text",""],[3,"ngModelChange","ionChange","ngModel"],["value","all"],["value","today"],["value","week"],["value","month"],[4,"ngIf"],["class","ion-text-center ion-padding",4,"ngIf"],[3,"click",4,"ngFor","ngForOf"],[3,"click"],["color","primary"],["lines","none",4,"ngFor","ngForOf"],["lines","none"],["color","medium"],[1,"ion-text-center","ion-padding"],["name","bag-handle-outline","size","large"],["expand","block","routerLink","/home"]],template:function(n,o){1&n&&(t.j41(0,"ion-header")(1,"ion-toolbar")(2,"ion-buttons",0),t.nrm(3,"ion-back-button",1),t.k0s(),t.j41(4,"ion-title"),t.EFF(5,"Mis Compras"),t.k0s()()(),t.j41(6,"ion-content")(7,"ion-item")(8,"ion-label"),t.EFF(9,"Filtrar por fecha"),t.k0s(),t.j41(10,"ion-select",2),t.mxI("ngModelChange",function(s){return t.DH7(o.filtroFecha,s)||(o.filtroFecha=s),s}),t.bIt("ionChange",function(s){return o.onFiltroChange(s)}),t.j41(11,"ion-select-option",3),t.EFF(12,"Todas las compras"),t.k0s(),t.j41(13,"ion-select-option",4),t.EFF(14,"Hoy"),t.k0s(),t.j41(15,"ion-select-option",5),t.EFF(16,"\xdaltima semana"),t.k0s(),t.j41(17,"ion-select-option",6),t.EFF(18,"\xdaltimo mes"),t.k0s()()(),t.DNE(19,E,2,1,"div",7)(20,j,8,0,"div",8),t.k0s()),2&n&&(t.R7$(10),t.R50("ngModel",o.filtroFecha),t.R7$(9),t.Y8G("ngIf",o.vauchers.length>0),t.R7$(),t.Y8G("ngIf",!o.vauchers.length))},dependencies:[C.Sq,C.bT,v.BC,v.vS,e.In,e.Jm,e.QW,e.b_,e.I9,e.ME,e.HW,e.tN,e.W9,e.eU,e.iq,e.uz,e.he,e.Nm,e.Ip,e.BC,e.ai,e.Je,e.el,e.N7,f.Wk,C.vh],styles:["ion-item-divider[_ngcontent-%COMP%]{--background: var(--ion-color-light);--padding-start: 16px;--padding-end: 16px;--padding-top: 8px;--padding-bottom: 8px}ion-item-divider[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-weight:700;margin:0}ion-item-divider[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:.8em;color:var(--ion-color-medium);margin:4px 0 0}.empty-state[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:2rem;text-align:center}.empty-state[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:64px;color:var(--ion-color-medium);margin-bottom:1rem}.empty-state[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.5rem;margin-bottom:.5rem;color:var(--ion-color-dark)}.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--ion-color-medium);margin-bottom:2rem}.empty-state[_ngcontent-%COMP%]   .shop-now[_ngcontent-%COMP%]{max-width:200px}ion-thumbnail[_ngcontent-%COMP%]{width:60px;height:60px;border-radius:8px;overflow:hidden;margin-right:12px}ion-note[_ngcontent-%COMP%]{font-weight:700}ion-card[_ngcontent-%COMP%]{margin:10px;border-radius:15px;box-shadow:0 4px 12px #0000001a}ion-card[_ngcontent-%COMP%]   ion-card-header[_ngcontent-%COMP%]{background:#f8f9fa;border-bottom:1px solid #eee}ion-card[_ngcontent-%COMP%]   ion-card-header[_ngcontent-%COMP%]   .fecha[_ngcontent-%COMP%]{float:right;color:var(--ion-color-medium);font-size:.9em}ion-card[_ngcontent-%COMP%]   ion-card-header[_ngcontent-%COMP%]   .total-amount[_ngcontent-%COMP%]{font-size:1.5em;color:var(--ion-color-primary);margin-top:10px}.item-details[_ngcontent-%COMP%]{margin:8px 0}.item-details[_ngcontent-%COMP%]   ion-badge[_ngcontent-%COMP%]{margin-right:8px;padding:4px 8px}.price-details[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;color:var(--ion-color-medium)}.price-details[_ngcontent-%COMP%]   .total[_ngcontent-%COMP%]{font-weight:700;color:var(--ion-color-dark)}.action-buttons[_ngcontent-%COMP%]{display:flex;justify-content:center;gap:1rem;margin-top:1rem}.action-buttons[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center}.action-buttons[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:1.5rem;margin-bottom:.25rem}.action-buttons[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{font-size:.75rem}.vaucher-card[_ngcontent-%COMP%]{margin:1rem}.vaucher-card[_ngcontent-%COMP%]   ion-card-subtitle[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}"]})),r})()}];let I=(()=>{var a;class r{}return a=r,(0,l.A)(r,"\u0275fac",function(n){return new(n||a)}),(0,l.A)(r,"\u0275mod",t.$C({type:a})),(0,l.A)(r,"\u0275inj",t.G2t({imports:[f.iI.forChild(k),f.iI]})),r})(),D=(()=>{var a;class r{}return a=r,(0,l.A)(r,"\u0275fac",function(n){return new(n||a)}),(0,l.A)(r,"\u0275mod",t.$C({type:a})),(0,l.A)(r,"\u0275inj",t.G2t({imports:[C.MD,v.YN,e.bv,I]})),r})()}}]);