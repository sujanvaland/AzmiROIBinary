import { Component,OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import {LoginserviceService } from '../../services/loginservice.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit{

  register: FormGroup;
  inviterName = "";
  placementid = "";
  position = "";
  submitted = false;
  constructor(private formBuilder: FormBuilder,
    private loginserviceService:LoginserviceService,
    private customerservice: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

ngOnInit (){
    this.register =this.formBuilder.group({
      Email: ['', [Validators.required,Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")]],
      Password: ['', [Validators.required,Validators.minLength(5)]],
      ConfirmPassword: ['', [Validators.required,Validators.minLength(5)]],
      SponsorsName: ['', Validators.required],
      PlacementUserName: ['', Validators.required],
      FirstName: ['', Validators.required],
      Phone: ['', Validators.required],
      UserName: ['', [Validators.required,Validators.pattern("^[a-zA-Z0-9\s]*$")]],
      Position:'',
      Manual:'0'
    });
    
    $('.loaderbo').show();
    let inviter = "";
    
    this.route.queryParams
    .subscribe(params => {
      if(params.r){
        inviter = params.r;
      }else{
        inviter = localStorage.getItem("inviter");
      }
      debugger
      this.loginserviceService.GetInviterDetail(inviter).subscribe(
        res =>{
          if(res.Message == "success"){
            this.inviterName = res.data.name;
            if(params.placement){
              if(params.placement){
                this.placementid = params.placement;
              }
              if(params.p){
                this.position = params.p;
              }
              this.register.get('PlacementUserName').setValue(this.placementid);
              this.register.get('SponsorsName').setValue(inviter);
              this.register.get('Position').setValue(this.position);
            }else{
              if(res.data.placement =='L' || res.data.placement == 'R'){
                this.position = res.data.placement;
              }
              
              this.loginserviceService.GetBinaryPlacementSetting(res.data.id).subscribe(result=>{
                this.placementid = result.Data.Placement;
                this.register.get('PlacementUserName').setValue(this.placementid);
                this.register.get('SponsorsName').setValue(inviter);
                this.position = result.Data.Position;
                if(result.Data.Position =='L' || result.Data.Position == 'R'){
                  this.register.get('Position').setValue(result.Data.Position);
                }
                
              },err => {  
                $('.loaderbo').hide();
              })
            }
            $('.loaderbo').hide();
          }
          else{
            this.toastr.error(res.Message)
            $('.loaderbo').hide();
          }
        },
        err => {  
          $('.loaderbo').hide();
        }
      );
    });
    
    
}

get primEmail(){
	return this.register.get('Email')
}

get f() { return this.register.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.register.invalid) {
            return;
        }
       
        if(this.register.value.SponsorsName != null){

        }
        else{
            this.toastr.info("Please use Inviter link","Error");
            return;
        }
        if(this.register.value.Password != this.register.value.ConfirmPassword){
          this.toastr.error("Confirm Password did not match with Password","Error");
          this.register.get('ConfirmPassword').setValue("");
          return;
        }
        $('.loaderbo').show();
        this.route.queryParams
        .subscribe(params => {
          debugger
            if(params.placement){
            this.register.value.Manual = "1";
            }
          }
        );
        this.loginserviceService.Register(this.register.value).subscribe(
          res => {
            if(res.Message == "success"){
              this.toastr.success("Your are successfully registered !!","Thank you")
              $('.loaderbo').hide();
              this.router.navigate(['/login']);
            }
            else{
              this.toastr.error(res.Message,"Error");
              $('.loaderbo').hide();
            }
          }
        )
    }

    onReset() {
        this.submitted = false;
        this.register.reset();
    }

  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-up';

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  IdSelection(Id){
    alert(Id);
  }

}
