export class UserModel{
    name: string;
    email: string;
    role: string;
    gender: string;
    urlAvatarProfile: string;
    uuid:string;

    constructor(name: string, email:string, role:string, gender:string, urlAvatarProfile:string, uuid:string){
        this.name = name;
        this.email= email; 
        this.role = role;
        this.uuid = uuid; 
        this.urlAvatarProfile = urlAvatarProfile;
        this.gender= gender;

    }
} 