// This file was generated from the aws-sdk-js-v3 at Thu Sep 07 2023 13:59:10 GMT+0200 (Central European Summer Time)
/* eslint-disable quote-props,comma-dangle */
export interface BlobTypeMapping {
  [service: string]: {
    [action: string]: string[]
  }
};
export const blobTypes: BlobTypeMapping = {
  'acm': {
    'exportcertificate': [
      'Passphrase'
    ],
    'importcertificate': [
      'Certificate',
      'CertificateChain',
      'PrivateKey'
    ]
  },
  'acm-pca': {
    'importcertificateauthoritycertificate': [
      'Certificate',
      'CertificateChain'
    ],
    'issuecertificate': [
      'Csr'
    ]
  },
  'apigateway': {
    'importapikeys': [
      'body'
    ],
    'importdocumentationparts': [
      'body'
    ],
    'importrestapi': [
      'body'
    ],
    'putrestapi': [
      'body'
    ],
    'posttoconnection': [
      'Data'
    ]
  },
  'appconfig': {
    'createhostedconfigurationversion': [
      'Content'
    ]
  },
  'appsync': {
    'startschemacreation': [
      'definition'
    ]
  },
  'awsmobilehubservice': {
    'createproject': [
      'contents'
    ],
    'updateproject': [
      'contents'
    ]
  },
  'backup-storage': {
    'notifyobjectcomplete': [
      'MetadataBlob'
    ],
    'putchunk': [
      'Data'
    ],
    'putobject': [
      'InlineChunk'
    ]
  },
  'cloudfront': {
    'createfunction': [
      'FunctionCode'
    ],
    'testfunction': [
      'EventObject'
    ],
    'updatefunction': [
      'FunctionCode'
    ]
  },
  'cloudsearch': {
    'uploaddocuments': [
      'documents'
    ]
  },
  'codeartifact': {
    'publishpackageversion': [
      'assetContent'
    ]
  },
  'codecommit': {
    'createcommit': [
      'putFiles.*.fileContent'
    ],
    'createunreferencedmergecommit': [
      'conflictResolution.replaceContents.*.content'
    ],
    'mergebranchesbysquash': [
      'conflictResolution.replaceContents.*.content'
    ],
    'mergebranchesbythreeway': [
      'conflictResolution.replaceContents.*.content'
    ],
    'mergepullrequestbysquash': [
      'conflictResolution.replaceContents.*.content'
    ],
    'mergepullrequestbythreeway': [
      'conflictResolution.replaceContents.*.content'
    ],
    'putfile': [
      'fileContent'
    ]
  },
  'cognito-idp': {
    'setuicustomization': [
      'ImageFile'
    ]
  },
  'comprehend': {
    'classifydocument': [
      'Bytes'
    ],
    'detectentities': [
      'Bytes'
    ]
  },
  'datasync': {
    'createlocationhdfs': [
      'KerberosKeytab',
      'KerberosKrb5Conf'
    ],
    'createlocationobjectstorage': [
      'ServerCertificate'
    ],
    'updatelocationhdfs': [
      'KerberosKeytab',
      'KerberosKrb5Conf'
    ],
    'updatelocationobjectstorage': [
      'ServerCertificate'
    ]
  },
  'dms': {
    'importcertificate': [
      'CertificateWallet'
    ]
  },
  'ebs': {
    'putsnapshotblock': [
      'BlockData'
    ]
  },
  'ec2': {
    'bundleinstance': [
      'Storage.S3.UploadPolicy'
    ],
    'importkeypair': [
      'PublicKeyMaterial'
    ],
    'modifyinstanceattribute': [
      'UserData.Value'
    ]
  },
  'ecr': {
    'uploadlayerpart': [
      'layerPartBlob'
    ]
  },
  'ecr-public': {
    'createrepository': [
      'catalogData.logoImageBlob'
    ],
    'putrepositorycatalogdata': [
      'catalogData.logoImageBlob'
    ],
    'uploadlayerpart': [
      'layerPartBlob'
    ]
  },
  'firehose': {
    'putrecord': [
      'Record.Data'
    ],
    'putrecordbatch': [
      'Records.*.Data'
    ]
  },
  'gamelift': {
    'createscript': [
      'ZipFile'
    ],
    'updatescript': [
      'ZipFile'
    ]
  },
  'gamesparks': {
    'importgameconfiguration': [
      'ImportSource.File'
    ]
  },
  'glacier': {
    'uploadarchive': [
      'body'
    ],
    'uploadmultipartpart': [
      'body'
    ]
  },
  'glue': {
    'updatecolumnstatisticsforpartition': [
      'ColumnStatisticsList.*.StatisticsData.DecimalColumnStatisticsData.MaximumValue.UnscaledValue'
    ],
    'updatecolumnstatisticsfortable': [
      'ColumnStatisticsList.*.StatisticsData.DecimalColumnStatisticsData.MaximumValue.UnscaledValue'
    ]
  },
  'greengrass': {
    'createcomponentversion': [
      'inlineRecipe'
    ]
  },
  'iot': {
    'createotaupdate': [
      'files.*.codeSigning.customCodeSigning.signature.inlineDocument'
    ],
    'testinvokeauthorizer': [
      'mqttContext.password'
    ]
  },
  'iotanalytics': {
    'batchputmessage': [
      'messages.*.payload'
    ],
    'runpipelineactivity': [
      'payloads.*'
    ]
  },
  'iotdata': {
    'publish': [
      'payload'
    ],
    'updatethingshadow': [
      'payload'
    ]
  },
  'ioteventsdata': {
    'batchputmessage': [
      'messages.*.payload'
    ]
  },
  'iotsitewise': {
    'createportal': [
      'portalLogoImageFile.data'
    ],
    'updateportal': [
      'portalLogoImage.file.data'
    ]
  },
  'iotwireless': {
    'updateresourceposition': [
      'GeoJsonPayload'
    ]
  },
  'kafka': {
    'createconfiguration': [
      'ServerProperties'
    ],
    'updateconfiguration': [
      'ServerProperties'
    ]
  },
  'kendra': {
    'batchputdocument': [
      'Documents.*.Blob'
    ]
  },
  'kinesis': {
    'putrecord': [
      'Data'
    ],
    'putrecords': [
      'Records.*.Data'
    ]
  },
  'kinesisanalytics': {
    'createapplication': [
      'ApplicationConfiguration.ApplicationCodeConfiguration.CodeContent.ZipFileContent'
    ],
    'updateapplication': [
      'ApplicationConfigurationUpdate.ApplicationCodeConfigurationUpdate.CodeContentUpdate.ZipFileContentUpdate'
    ]
  },
  'kms': {
    'decrypt': [
      'CiphertextBlob',
      'Recipient.AttestationDocument'
    ],
    'encrypt': [
      'Plaintext'
    ],
    'generatedatakey': [
      'Recipient.AttestationDocument'
    ],
    'generatedatakeypair': [
      'Recipient.AttestationDocument'
    ],
    'generatemac': [
      'Message'
    ],
    'generaterandom': [
      'Recipient.AttestationDocument'
    ],
    'importkeymaterial': [
      'EncryptedKeyMaterial'
    ],
    'reencrypt': [
      'CiphertextBlob'
    ],
    'sign': [
      'Message'
    ],
    'verify': [
      'Message',
      'Signature'
    ],
    'verifymac': [
      'Mac',
      'Message'
    ]
  },
  'lambda': {
    'createfunction': [
      'Code.ZipFile'
    ],
    'invoke': [
      'Payload'
    ],
    'invokeasync': [
      'InvokeArgs'
    ],
    'invokewithresponsestream': [
      'Payload'
    ],
    'publishlayerversion': [
      'Content.ZipFile'
    ],
    'updatefunctioncode': [
      'ZipFile'
    ]
  },
  'lex': {
    'startimport': [
      'payload'
    ],
    'postcontent': [
      'inputStream'
    ],
    'recognizeutterance': [
      'inputStream'
    ]
  },
  'lookoutvision': {
    'detectanomalies': [
      'Body'
    ],
    'updatedatasetentries': [
      'Changes'
    ]
  },
  'mediastore': {
    'putobject': [
      'Body'
    ]
  },
  'mobiletargeting': {
    'sendmessages': [
      'MessageRequest.MessageConfiguration.EmailMessage.RawEmail.Data'
    ],
    'sendusersmessages': [
      'SendUsersMessageRequest.MessageConfiguration.EmailMessage.RawEmail.Data'
    ]
  },
  'qldb': {
    'sendcommand': [
      'CommitTransaction.CommitDigest',
      'ExecuteStatement.Parameters.*.IonBinary'
    ]
  },
  'quicksight': {
    'startassetbundleimportjob': [
      'AssetBundleImportSource.Body'
    ]
  },
  'rekognition': {
    'comparefaces': [
      'SourceImage.Bytes'
    ],
    'detectcustomlabels': [
      'Image.Bytes'
    ],
    'detectfaces': [
      'Image.Bytes'
    ],
    'detectlabels': [
      'Image.Bytes'
    ],
    'detectmoderationlabels': [
      'Image.Bytes'
    ],
    'detectprotectiveequipment': [
      'Image.Bytes'
    ],
    'detecttext': [
      'Image.Bytes'
    ],
    'indexfaces': [
      'Image.Bytes'
    ],
    'recognizecelebrities': [
      'Image.Bytes'
    ],
    'searchfacesbyimage': [
      'Image.Bytes'
    ],
    'searchusersbyimage': [
      'Image.Bytes'
    ],
    'updatedatasetentries': [
      'Changes.GroundTruth'
    ]
  },
  's3': {
    'putobject': [
      'Body'
    ],
    'uploadpart': [
      'Body'
    ],
    'writegetobjectresponse': [
      'Body'
    ]
  },
  'sagemaker': {
    'invokeendpoint': [
      'Body'
    ],
    'invokeendpointwithresponsestream': [
      'Body'
    ]
  },
  'secretsmanager': {
    'createsecret': [
      'SecretBinary'
    ],
    'putsecretvalue': [
      'SecretBinary'
    ],
    'updatesecret': [
      'SecretBinary'
    ]
  },
  'ses': {
    'createdeliverabilitytestreport': [
      'Content.Raw.Data',
      'Content.Raw.Data'
    ],
    'sendemail': [
      'Content.Raw.Data',
      'Content.Raw.Data'
    ],
    'sendrawemail': [
      'RawMessage.Data'
    ]
  },
  'signer': {
    'signpayload': [
      'payload'
    ]
  },
  'ssm': {
    'registertaskwithmaintenancewindow': [
      'TaskInvocationParameters.Lambda.Payload'
    ],
    'updatemaintenancewindowtask': [
      'TaskInvocationParameters.Lambda.Payload'
    ]
  },
  'support': {
    'addattachmentstoset': [
      'attachments.*.data'
    ]
  },
  'synthetics': {
    'createcanary': [
      'Code.ZipFile'
    ],
    'updatecanary': [
      'Code.ZipFile'
    ]
  },
  'textract': {
    'analyzedocument': [
      'Document.Bytes'
    ],
    'analyzeexpense': [
      'Document.Bytes'
    ],
    'analyzeid': [
      'DocumentPages.*.Bytes'
    ],
    'detectdocumenttext': [
      'Document.Bytes'
    ]
  },
  'translate': {
    'importterminology': [
      'TerminologyData.File'
    ],
    'translatedocument': [
      'Document.Content'
    ]
  },
  'waf': {
    'updatebytematchset': [
      'Updates.*.ByteMatchTuple.TargetString'
    ]
  },
  'waf-regional': {
    'updatebytematchset': [
      'Updates.*.ByteMatchTuple.TargetString'
    ]
  },
  'wafv2': {
    'checkcapacity': [
      'Rules.*.Statement.ByteMatchStatement.SearchString'
    ],
    'createrulegroup': [
      'Rules.*.Statement.ByteMatchStatement.SearchString'
    ],
    'createwebacl': [
      'Rules.*.Statement.ByteMatchStatement.SearchString'
    ],
    'updaterulegroup': [
      'Rules.*.Statement.ByteMatchStatement.SearchString'
    ],
    'updatewebacl': [
      'Rules.*.Statement.ByteMatchStatement.SearchString'
    ]
  },
  'workspaces': {
    'importclientbranding': [
      'DeviceTypeAndroid.Logo',
      'DeviceTypeIos.Logo',
      'DeviceTypeIos.Logo2x',
      'DeviceTypeIos.Logo3x'
    ]
  }
};
