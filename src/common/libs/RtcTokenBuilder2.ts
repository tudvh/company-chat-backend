import { AccessToken2 as AccessToken, ServiceRtc, ServiceRtm } from './AccessToken2'

enum Role {
  PUBLISHER = 1,
  SUBSCRIBER = 2,
}

class RtcTokenBuilder {
  static buildTokenWithUid(
    appId: string,
    appCertificate: string,
    channelName: string,
    uid: number,
    role: Role,
    tokenExpire: number,
    privilegeExpire: number = 0,
  ): string {
    return this.buildTokenWithUserAccount(
      appId,
      appCertificate,
      channelName,
      uid.toString(),
      role,
      tokenExpire,
      privilegeExpire,
    )
  }

  static buildTokenWithUserAccount(
    appId: string,
    appCertificate: string,
    channelName: string,
    account: string,
    role: Role,
    tokenExpire: number,
    privilegeExpire: number = 0,
  ): string {
    let token = new AccessToken(appId, appCertificate, 0, tokenExpire)

    let serviceRtc = new ServiceRtc(channelName, account)
    serviceRtc.add_privilege(ServiceRtc.kPrivilegeJoinChannel, privilegeExpire)
    if (role === Role.PUBLISHER) {
      serviceRtc.add_privilege(ServiceRtc.kPrivilegePublishAudioStream, privilegeExpire)
      serviceRtc.add_privilege(ServiceRtc.kPrivilegePublishVideoStream, privilegeExpire)
      serviceRtc.add_privilege(ServiceRtc.kPrivilegePublishDataStream, privilegeExpire)
    }
    token.add_service(serviceRtc)

    return token.build()
  }

  static buildTokenWithUidAndPrivilege(
    appId: string,
    appCertificate: string,
    channelName: string,
    uid: number,
    tokenExpire: number,
    joinChannelPrivilegeExpire: number,
    pubAudioPrivilegeExpire: number,
    pubVideoPrivilegeExpire: number,
    pubDataStreamPrivilegeExpire: number,
  ): string {
    return this.BuildTokenWithUserAccountAndPrivilege(
      appId,
      appCertificate,
      channelName,
      uid.toString(),
      tokenExpire,
      joinChannelPrivilegeExpire,
      pubAudioPrivilegeExpire,
      pubVideoPrivilegeExpire,
      pubDataStreamPrivilegeExpire,
    )
  }

  static BuildTokenWithUserAccountAndPrivilege(
    appId: string,
    appCertificate: string,
    channelName: string,
    account: string,
    tokenExpire: number,
    joinChannelPrivilegeExpire: number,
    pubAudioPrivilegeExpire: number,
    pubVideoPrivilegeExpire: number,
    pubDataStreamPrivilegeExpire: number,
  ): string {
    let token = new AccessToken(appId, appCertificate, 0, tokenExpire)

    let serviceRtc = new ServiceRtc(channelName, account)
    serviceRtc.add_privilege(ServiceRtc.kPrivilegeJoinChannel, joinChannelPrivilegeExpire)
    serviceRtc.add_privilege(ServiceRtc.kPrivilegePublishAudioStream, pubAudioPrivilegeExpire)
    serviceRtc.add_privilege(ServiceRtc.kPrivilegePublishVideoStream, pubVideoPrivilegeExpire)
    serviceRtc.add_privilege(ServiceRtc.kPrivilegePublishDataStream, pubDataStreamPrivilegeExpire)
    token.add_service(serviceRtc)

    return token.build()
  }

  static buildTokenWithRtm(
    appId: string,
    appCertificate: string,
    channelName: string,
    account: string,
    role: Role,
    tokenExpire: number,
    privilegeExpire: number = 0,
  ): string {
    let token = new AccessToken(appId, appCertificate, 0, tokenExpire)

    let serviceRtc = new ServiceRtc(channelName, account)
    serviceRtc.add_privilege(ServiceRtc.kPrivilegeJoinChannel, privilegeExpire)
    if (role === Role.PUBLISHER) {
      serviceRtc.add_privilege(ServiceRtc.kPrivilegePublishAudioStream, privilegeExpire)
      serviceRtc.add_privilege(ServiceRtc.kPrivilegePublishVideoStream, privilegeExpire)
      serviceRtc.add_privilege(ServiceRtc.kPrivilegePublishDataStream, privilegeExpire)
    }
    token.add_service(serviceRtc)

    let serviceRtm = new ServiceRtm(account)
    serviceRtm.add_privilege(ServiceRtm.kPrivilegeLogin, tokenExpire)
    token.add_service(serviceRtm)

    return token.build()
  }
}

export { RtcTokenBuilder, Role }
