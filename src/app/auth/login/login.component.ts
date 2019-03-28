import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UsersService } from 'src/app/shared/services/users.service';
import { User } from 'src/app/shared/models/user.model';
import { Message } from 'src/app/shared/models/message.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'sts-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  message: Message;

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.message = new Message('danger', '');

    this.route.queryParams.subscribe((params: Params) => {
      if(params['nowCanLogin'])
      {
        this.showMessage({ 
          text: 'Now you can use the system', 
          type: 'success'
        })
      }
    });    

    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  private showMessage(message: Message){
    this.message = message;
    window.setTimeout(() => {
      this.message.text = ''
    }, 5000);
  }

  onSubmit(){
    const formData = this.form.value;

    this.userService.getUserByEmail(formData.email)
      .subscribe((user: User) => {console.log(user);
        if(user){
          if(user.password === formData.password){             
            this.message.text = '';
            window.localStorage.setItem('user', JSON.stringify(user));
            this.authService.login();
            //TODO: this.router.navigate(['']);
          }
          else{
            this.showMessage({
              text:'Wrong password',
              type: 'danger'
            });
          }
        }
        else{
          this.showMessage({ 
            text: 'User not found',
            type: 'danger'
          });
        }
      })
  }
}
