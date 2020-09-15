import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
declare let appManager: AppManagerPlugin.AppManager;

interface Donate {
  receiver: string; 
  amount: number; 
  memo: string;
}

@Component({
  selector: 'app-donate',
  templateUrl: './donate.page.html',
  styleUrls: ['./donate.page.scss'],
})
export class DonatePage implements OnInit {

  donateForm: FormGroup;

  constructor(public fb: FormBuilder) { }

  pay(
      receiver: string, amount: number, memo: string, 
      onSuccess: (res:any)=>void, onError: (err: any)=>void){
    let param = {
      receiver: receiver, 
      amount: amount, 
      memo: memo
    }

    appManager.sendIntent("pay", param, {}, 
      (response: any) => {
        onSuccess(response);
      },
      (err)=>{
        onError(err);
      }
    );
  }

  ngOnInit() {
    this.donateForm = this.fb.group({
      receiver: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      memo: ['', [Validators.required]],
    })
  }

  Pay(onSuccess: (res:any)=>void, onError: (err: any)=>void) {
    this.donateForm = this.fb.group({
      receiver: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      memo: ['', [Validators.required]],
    })

    appManager.sendIntent("pay", this.Pay, {}, 
      (response: any) => {
        onSuccess(response);
      },
      (err)=>{
        onError(err);
      }
    );
  }

}
