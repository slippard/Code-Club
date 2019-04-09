interface IData {
    token: string,
    ownerid: string,
    prefix: string,
    dburl: string,
    modlog: string,
    defaultServer?: string
}

/**
* Required parameters to launch client.
* @param token Discord Bot Token
* @param ownerid Discord ID for client owner
* @param prefix Prefix client should respond to
* @param dburl MongoDB URL Ex: mongodb://<dbuser>:<dbpassword>@<hostname>/<collection>
* @param modlog Discord Text Channel ID For modlog related outputs
* @param defaultServer Discord Server ID for server containing modlog text channel
*/
export const data: IData = {
    defaultServer: 'Server ID',
    modlog: 'Channel Id',
    prefix: 'cc!',
    dburl: 'Database Url',
    ownerid: 'Owner Id',
    token: 'Bot Token'
}