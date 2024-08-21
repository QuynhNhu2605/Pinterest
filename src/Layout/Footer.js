import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import LogoutLoginButton from './LogoutLoginButton';
function Footer() {
    return (
        <section class="py-10 bg-gray-50 sm:pt-16 lg:pt-24"
        //  style={{position:"absolute", bottom:"0", width:"100%"}}
         > 
        <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            
    
            <hr class="mt-16 mb-10 border-gray-200" />
    
            <p class="text-sm text-center text-gray-600">© Copyright 2024, Create by Quynh Nhu</p>
        </div>
    </section>
    
      );
}

export default Footer;
