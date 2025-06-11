"use server"


import {UserService} from "@/services/user.service"
import {revalidatePath} from "next/cache"
import {User} from "@prisma/client"
import {ParamsSchemaFormValues} from "@/schemas/index.schema"
import {CreateUserFormValues, PasswordFormValues} from "@/schemas/user.schema"
import { ActionResult } from "@/lib/action-result"

export async function createUserAction(data: CreateUserFormValues) {
    return await UserService.createUser(data)
}
export async function createUsersAction(data: CreateUserFormValues[]) {
    return await UserService.createUsers(data)
}
export async function getCurrentUserAction() {
    return await UserService.getUserCurrent()
}

export async function getUsersWithPaginationAction(params: ParamsSchemaFormValues) {
    return await UserService.getUsersWithPagination(params)
}

export async function getUsersByHospitalAction(params: ParamsSchemaFormValues) {
    return await UserService.getUsersByHospital(params)
}

export async function deleteUserAction(userId: string) {
     const result = await UserService.deleteUser(userId)
    revalidatePath("/admin/users")
    return result
}

export async function updatePasswordAction( data:PasswordFormValues){
    const result = await UserService.updatePassword(data)
    revalidatePath("/account")
    return result
}

export async function deleteMultipleUsersAction(userIds:string[]){
    const result = await UserService.deleteMultipleUsers(userIds)
    revalidatePath("/admin/users")
    return result
}

export async function updateUserAction(userId: string, data: Partial<User>) {

    return await UserService.updateUser(userId, data)
}

export async function getUsersByDateRangeAction(params: {
    startDate: Date;
    endDate: Date;
    page?: number;
    perPage?: number;
}) {
    return await UserService.getUsersByDateRange(params)
}

export async function getLatestUsersAction(limit: number = 10) {
    return await UserService.getLatestUsers(limit)
}

export async function getUserStatsAction() {
    return await UserService.getUserStats()
}

export async function getUserWithRelationsAction(userId: string) {
    return await UserService.getUserWithRelations(userId)
}

// Personnel functions for director dashboard
export async function getPersonnelStatsAction(): Promise<ActionResult<any>> {
    return await UserService.getPersonnelStats()
}

export async function getPersonnelsByDateRangeAction(params: {
    startDate: Date;
    endDate: Date;
    page?: number;
    perPage?: number;
}): Promise<ActionResult<any>> {
    return await UserService.getPersonnelsByDateRange(params)
}

export async function getLatestPersonnelsAction(limit: number = 5): Promise<ActionResult<any[]>> {
    return await UserService.getLatestPersonnels(limit)
}