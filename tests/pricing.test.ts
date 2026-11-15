import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate,defaultPrices,CartItem,mergeIdenticalItems} from '../lib/pricing-core';
const item=(overrides:Partial<CartItem>):CartItem=>({id:'x',type:'sofa',variant:'2',quantity:1,heavy:false,secondSide:false,...overrides});
test('base price and minimum cleaning amount',()=>{const r=calculate([item({})],defaultPrices,false);assert.equal(r.knownSubtotal,2800);assert.equal(r.cleaningTotal,2800);assert.equal(r.travelFee,0);});
test('heavy soil and second mattress side are additive on base, rounded once',()=>{const r=calculate([item({type:'mattress',variant:'single',heavy:true,secondSide:true})],defaultPrices,false);assert.equal(r.knownSubtotal,4070);});
test('minimum applies to cleaning, travel is added after minimum',()=>{const p={...defaultPrices,chairSeat:300,minOrder:2500,outsideCityFee:900};const r=calculate([item({type:'chair',variant:'seat',quantity:1})],p,true);assert.equal(r.cleaningTotal,2500);assert.equal(r.travelFee,900);assert.equal(r.estimateTotal,3400);});
test('manual estimate stays unknown in mixed cart',()=>{const r=calculate([item({}),item({id:'y',type:'other',variant:'custom',description:'Пуф'})],defaultPrices,false);assert.equal(r.knownSubtotal,2800);assert.equal(r.estimateTotal,null);assert.equal(r.hasManual,true);assert.equal(r.manualItems,1);});
test('percentage rounding is per unit before quantity multiplication',()=>{const r=calculate([item({quantity:2,heavy:true})],{...defaultPrices,sofa2:1001,heavySoilingPercent:12.5},false);assert.equal(r.knownSubtotal,2252);});

test('identical cart lines merge but different options stay separate',()=>{const lines=mergeIdenticalItems([item({quantity:2}),item({id:'y',quantity:3}),item({id:'z',heavy:true})]);assert.equal(lines.length,2);assert.equal(lines.find(x=>!x.heavy)?.quantity,5);});
