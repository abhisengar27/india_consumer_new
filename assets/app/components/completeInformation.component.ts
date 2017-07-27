import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";

import { PersonalDetailsObject } from "../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../interfaces/userDetails.interface";
import { OAOService } from "../services/OAO.Service";
import { TranslateService } from '@ngx-translate/core';


declare var jQuery: any;
@Component({
  selector: 'complete-information',
  templateUrl: './completeInformation.component.html'
})
export class CompleteInformation implements OnInit, AfterViewInit, OnDestroy {

  private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');

  private stepStatus: string[] = [];
  // private width1: String = '0';
  // private width2: String = '0';
  private constWidth: number = 25;
  private sectionCount: number = 4;

  private limit1: number = 0;
  private width1: number = 0;
  private limit2: number = -25;
  private width2: number = 0;
  private id1;
  private id2;
  private progressBarConfig;
  private subscription;
  private langSubscription;

  ascFrame1() {
    if (this.width1 >= this.limit1) {
      clearInterval(this.id1);
    } else {
      this.width1++;
    }
  }

  moveForward1() {
    this.limit1 += this.constWidth;
    this.id1 = setInterval(() => { this.ascFrame1(); }, 10);

  }

  // ascFrame2() {


  //     if (this.width2 >= this.limit2) {
  //       clearInterval(this.id2);
  //     } 
  //     else {
  //       this.width2++; 
  //     }
  //   }

  moveForward2() {
    this.limit2 += this.constWidth;


    var self = this;
    var ival = setInterval(ascFrame2, 25);
    function ascFrame2() {

      if (self.width2 >= self.limit2) {
        clearInterval(ival);
      }
      else {
        self.width2++;

      }
    }

  }

  descFrame1() {
    if (this.width1 <= this.limit1) {
      clearInterval(this.id1);
    } else {
      this.width1--;
    }
  }


  moveBack1() {

    this.limit1 -= this.constWidth;
    this.id1 = setInterval(() => { this.descFrame1(); }, 10);

  }



  descFrame2() {

    if (this.width2 <= this.limit2) {
      clearInterval(this.id2);
    } else {

      this.width2--;

    }

  }

  moveBack2() {

    this.limit2 -= this.constWidth;
    if (this.width2 == 0) {
      return;
    }
    var id2 = setInterval(() => { this.descFrame2(); }, 10);

  }



  updateProgressBar(data: string[]) {

    this.stepStatus = data;

    if (data[this.sectionCount] == 'Y') {
      this.moveForward1();
      this.moveForward2();
    }
    if (data[this.sectionCount + 1] == 'Y') {
      this.moveBack1();
      this.moveBack2();
    }

  }

  product_name: string;

  constructor(private oaoService: OAOService, private router: Router, private translate: TranslateService) {
    jQuery('#content1').css('overflow', 'hidden');
    console.log("CompleteInformation Component constructor()");
    this.model = this.oaoService.getPersonalDetailsObject();

    this.oaoService.setLang(translate.currentLang);
    if (!this.oaoService.getResumeStatus()) {
      console.log("inside if")
      this.oaoService.getConfigByKey(this.model.product_code, translate.currentLang)
        .subscribe((response) => {
          this.progressBarConfig = JSON.parse(JSON.stringify(response.data));
          this.sectionCount = Object.keys(this.progressBarConfig).length;
          this.constWidth = 100 / this.sectionCount;
          this.limit2 = -1 * this.constWidth;
        });
    }
    else {
      console.log("inside else"+this.model.product_type_code)
      this.sectionCount = this.model.sectionCount;
      this.progressBarConfig = this.model.progressBarConfig;
      console.log("Resume section count is ", this.sectionCount);
      this.constWidth = 100 / this.sectionCount;
      if(this.model.product_type_code="LAA"){
      //this.stepStatus = this.oaoService.getProgressBardata();
      // console.log("stepstatus",this.stepStatus);
      this.limit1 = parseInt(this.stepStatus[this.sectionCount]);
      this.limit2 = this.limit1 - this.constWidth;
      }else{
         this.stepStatus = this.oaoService.getProgressBardata();
         console.log("stepstatus",this.stepStatus);
      this.limit1 = parseInt(this.stepStatus[this.sectionCount]);
      this.limit2 = this.limit1 - this.constWidth;
      }
    }

    this.oaoService.fetchDigilockerConfig().subscribe(config => {
      this.oaoService.setDigilockerConfig(config);
    });

    // console.log(this.model);

    switch (this.model.product_code) {
      case 'BNA':
        this.translate.get('SAVINGS_ACCOUNT.PRODUCT_TYPE').subscribe((res) => {
          this.product_name = res;
        })
        this.langSubscription = this.oaoService.changelangEvent.subscribe(lang => {
          this.translate.get('SAVINGS_ACCOUNT.PRODUCT_TYPE').subscribe((res) => {
            this.product_name = res;
          })

        });
        break;
      case 'SAL1':
        this.translate.get('SALARY_ACCOUNT.PRODUCT_TYPE').subscribe((res) => {
          this.product_name = res;
          //console.log(this.product_name);
        });
        this.langSubscription = this.oaoService.changelangEvent.subscribe(lang => {
          this.translate.get('SALARY_ACCOUNT.PRODUCT_TYPE').subscribe((res) => {
            this.product_name = res;
          })

        });
        break;
         case 'VL1':
        this.translate.get('CARLOAN.PRODUCT_TYPE').subscribe((res) => {
          this.product_name = res;
          console.log(this.product_name);
        });
        this.langSubscription = this.oaoService.changelangEvent.subscribe(lang => {
          this.translate.get('CARLOAN.PRODUCT_TYPE').subscribe((res) => {
            this.product_name = res;
          })

        });
        break;
    }
  }
  ngOnInit() {
    console.log("ngOnInit()");
    jQuery('.number-progress-bar ul').children().find('span.stepvalue').eq(0).addClass('active');
    this.subscription = this.oaoService.progressBarChangeEvent.subscribe(data => {
      console.log(" proogress data", data);
      this.updateProgressBar(data)
    });
    this.langSubscription = this.oaoService.changelangEvent.subscribe(lang => {
      this.model = this.oaoService.getPersonalDetailsObject();
      console.log("inside change lang event", this.model);
      if (this.oaoService.getUpsellFlag()) {
        // this.product_name = this.model.product_name;
      }
      this.oaoService.getConfigByKey(this.model.product_code, lang)
        .subscribe((response) => {
          this.progressBarConfig = JSON.parse(JSON.stringify(response.data));
        });

    });
  }
  ngAfterViewInit() {
    if (this.oaoService.getResumeStatus()) {
      this.moveForward1();
      this.moveForward2();
      this.oaoService.setResumeStatus(false);
    }

  }

  ngOnDestroy() {

    this.subscription.unsubscribe();
    this.langSubscription.unsubscribe();
  }



}
