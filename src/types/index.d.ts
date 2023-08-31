export interface IDownLinkRes{
    download_link:string
}
export interface IAccess{
    access_token:string;
    app_name:string;
    dtable_db:string;
    dtable_name:string;
    dtable_server:string;
    dtable_socket:  string;
    dtable_uuid:string;
    workspace_id:number;
}
export interface IUpload{
    file_relative_path:string;
    img_relative_path:string;
    parent_path:string;
    upload_link:string
}
export interface ICodePic{
    openid:string;
    createtime:string;
    collectname:string;
    filePath:string;
    codeurl:string;
    _id:string;
}
export interface IUploadRes{
    addRes:{
        inserted_row_count:number;

    };
    collectInfo:ICodePic
}
export interface INodeAjax{
    code:number;
    message:string;
    data:{
        openId?:string;
        fileData?:{
            fileUrl:string;
            fileName:string;
            filePath:string;
        }
    }
}