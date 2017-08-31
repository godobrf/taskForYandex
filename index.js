class myForm {
   constructor(name) {
      this.form  = document.getElementById('myForm');
      this.fio   = this.form.fio;
      this.email = this.form.email;
      this.phone = this.form.phone;
      this.submitButton = document.getElementById('submitButton');
      this.resultContainer = document.getElementById('resultContainer');
      this.form.addEventListener('submit', (e) => {e.preventDefault(); this.submit()});
   }

   getData() {
      return {
         'fio':   this.fio.value,
         'email': this.email.value,
         'phone': this.phone.value};
   }

   setData(Object) {
      if (Object.hasOwnProperty('fio')) {
         this.fio.value = Object['fio'];}
      if (Object.hasOwnProperty('email')) {
         this.email.value = Object['email'];}
      if (Object.hasOwnProperty('phone')) {
         this.phone.value = Object['phone'];}
   }

   validate() {
      const result = {isValid: true, errorFields: []};

      if (this.fio.value.split(' ').length !== 3) {
         result.isValid = false;
         result.errorFields.push('ФИО');
      }

      let isValidEmail =
          /^[A-Za-z0-9_.+-]+@ya(\.ru|ndex\.(ru|ua|by|kz|com))$/i.test(this.email.value);

      if (!isValidEmail) {
         result.isValid = false;
         result.errorFields.push('Email');
      }

      let isValidPhone    = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i.test(this.phone.value);
      let isValidPhoneSum = this.phone.value.match(/\d/g).reduce((a, b) => +a + +b) <= 30;

      if (!isValidPhone || !isValidPhoneSum) {
         result.isValid = false;
         result.errorFields.push('Телефон');
      }

      return result;
   }

   submit() {
      let validation = this.validate();
      let errors = Array.prototype.slice.call(this.form.getElementsByClassName('error'));

      for (let i = 0; i < errors.length; i++) {
         errors[i].classList.remove('error');}

      if (validation.isValid === false) {
         this.form.action = 'responses/error.json';
         this.resultContainer.textContent = 'error: ' + validation.errorFields;
         this.resultContainer.classList.add('error');
         response('error.json');
      } else {
         this.resultContainer.classList.remove('error');
         this.form.action = 'responses/progress.json';
         this.resultContainer.classList.add('progress');
         this.resultContainer.textContent = 'Waiting...';

         this.submitButton.disabled = true;
         this.form.action = 'responses/success.json';
         this.resultContainer.classList.remove('error', 'progress');
         this.resultContainer.classList.add('success');
         this.resultContainer.textContent = 'success';
         response('success.json');
      }

      function response(name) {
         let xhr = new XMLHttpRequest();
         let url = '/responses/' + name;
         xhr.open('GET', url);
         xhr.send();
      }
   }
}

let MyForm = new myForm('myForm');
