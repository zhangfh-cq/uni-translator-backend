type User = {
    id?: string,
    username: string,
    password: string,
    salt: string,
    email: string,
    email_active?: boolean,
    email_code?: string,
    email_expire?: string,
    autograph?: string,
    create_time?: string,
    update_time?: string
}

export default User;