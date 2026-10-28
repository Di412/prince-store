/* Ringkasan di header: salin dari kartu laporan */
(function(){var m={'k-bersih':'h-bersih','k-jual':'h-jual','k-cut':'h-cut'};
Object.keys(m).forEach(function(k){var s=document.getElementById(k),t=document.getElementById(m[k]);if(!s||!t)return;
var f=function(){t.textContent=s.textContent;};f();new MutationObserver(f).observe(s,{childList:true,characterData:true,subtree:true});});})();
