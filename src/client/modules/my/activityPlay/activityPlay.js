"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lwc_1 = require("lwc");
class ActivityPlay extends lwc_1.LightningElement {
    constructor() {
        super(...arguments);
        this.activity1 = 'Activity 1';
        this.activity2 = 'Activity 2';
        this.activity3 = 'Activity 3';
    }
    handleNameChange(event) {
        const name = event.detail.value;
        const element = event.detail.sender;
        switch (element.getAttribute('data-name')) {
            case 'activity1':
                this.activity1 = name;
                break;
            case 'activity2':
                this.activity2 = name;
                break;
            case 'activity3':
                this.activity3 = name;
                break;
        }
    }
}
__decorate([
    lwc_1.track
], ActivityPlay.prototype, "activity1", void 0);
__decorate([
    lwc_1.track
], ActivityPlay.prototype, "activity2", void 0);
__decorate([
    lwc_1.track
], ActivityPlay.prototype, "activity3", void 0);
exports.default = ActivityPlay;
