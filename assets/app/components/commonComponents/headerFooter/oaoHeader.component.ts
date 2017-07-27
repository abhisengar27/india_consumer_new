import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import { OAOService } from "../../../services/OAO.Service";

declare var jQuery:any;
@Component({
    selector: 'oao-header',
    templateUrl: './oaoHeader.component.html'
    
})
export class oaoHeaderComponent{
     constructor(private translate: TranslateService, private oaoService: OAOService) {
        translate.addLangs(["English","Hindi","Kannada"]);
        translate.setDefaultLang('English');

        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/English|Hindi|Kannada/) ? browserLang : 'English');
        
    }
    clear(){
        window.location.href=this.oaoService.getBaseUrl();
        localStorage.clear();
    }

    changeLang(lang){
        this.oaoService.changelangEvent.emit(lang);
        this.oaoService.setLang(lang);
    }

}