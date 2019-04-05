import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UsersService } from 'src/app/shared/services/users.service';
import { User } from 'src/app/shared/models/user.model';
import { Message } from 'src/app/shared/models/message.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { fadeStateTrigger } from 'src/app/shared/animations/fade.animation';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'sts-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeStateTrigger]
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  message: Message;

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) { 
    title.setTitle('Вход в систему');
    meta.addTags([
      {
        name: 'keywords',
        content: 'login, cyctem'
      },
      {
        name: 'description',
        content: 'Page for comming'
      }
    ]);
  }

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
      else if(params['accessDenied']){
        this.showMessage({ 
          text: 'Access denied', 
          type: 'warning'
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
      .subscribe((user: User) => {
        if(user){
          if(user.password === formData.password){             
            this.message.text = '';
            window.localStorage.setItem('user', JSON.stringify(user));
            this.authService.login();
            this.router.navigate(['/system', 'bill']);
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
