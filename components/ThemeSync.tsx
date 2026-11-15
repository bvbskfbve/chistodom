'use client';import {useEffect} from 'react';
export default function ThemeSync(){useEffect(()=>{const theme=localStorage.getItem('chistodom-theme');document.documentElement.classList.toggle('dark',theme==='dark');},[]);return null;}
