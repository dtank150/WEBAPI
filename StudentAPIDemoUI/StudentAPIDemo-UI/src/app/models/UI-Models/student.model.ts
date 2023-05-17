import { Gender } from "./gender.model"
import { Address } from "./address.model"

export interface Student{
    id: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    email: string,
    mobile: number,
    profileImageUrl: string,
    genderId: string,
    gender: Gender,
    address: Address
}