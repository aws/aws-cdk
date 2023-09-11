// This file was generated from the aws-sdk-js-v3 at Fri Sep 08 2023 19:02:40 GMT+0200 (Central European Summer Time)
/* eslint-disable quote-props,comma-dangle */
export interface TypeCoercionMap {
  [service: string]: {
    [action: string]: string[]
  }
};
export const UINT8ARRAY_PARAMETERS: TypeCoercionMap = {
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
  'clouddirectory': {
    'addfacettoobject': [
      'ObjectAttributeList.*.Value.BinaryValue'
    ],
    'attachtypedlink': [
      'Attributes.*.Value.BinaryValue'
    ],
    'batchread': [
      'Operations.*.GetLinkAttributes.TypedLinkSpecifier.IdentityAttributeValues.*.Value.BinaryValue',
      'Operations.*.ListIncomingTypedLinks.FilterAttributeRanges.*.Range.EndValue.BinaryValue',
      'Operations.*.ListIncomingTypedLinks.FilterAttributeRanges.*.Range.StartValue.BinaryValue',
      'Operations.*.ListIndex.RangesOnIndexedValues.*.Range.EndValue.BinaryValue',
      'Operations.*.ListIndex.RangesOnIndexedValues.*.Range.StartValue.BinaryValue',
      'Operations.*.ListOutgoingTypedLinks.FilterAttributeRanges.*.Range.EndValue.BinaryValue',
      'Operations.*.ListOutgoingTypedLinks.FilterAttributeRanges.*.Range.StartValue.BinaryValue'
    ],
    'batchwrite': [
      'Operations.*.AddFacetToObject.ObjectAttributeList.*.Value.BinaryValue',
      'Operations.*.AttachTypedLink.Attributes.*.Value.BinaryValue',
      'Operations.*.CreateObject.ObjectAttributeList.*.Value.BinaryValue',
      'Operations.*.DetachTypedLink.TypedLinkSpecifier.IdentityAttributeValues.*.Value.BinaryValue',
      'Operations.*.UpdateLinkAttributes.AttributeUpdates.*.AttributeAction.AttributeUpdateValue.BinaryValue',
      'Operations.*.UpdateLinkAttributes.TypedLinkSpecifier.IdentityAttributeValues.*.Value.BinaryValue',
      'Operations.*.UpdateObjectAttributes.AttributeUpdates.*.ObjectAttributeAction.ObjectAttributeUpdateValue.BinaryValue'
    ],
    'createfacet': [
      'Attributes.*.AttributeDefinition.DefaultValue.BinaryValue'
    ],
    'createobject': [
      'ObjectAttributeList.*.Value.BinaryValue'
    ],
    'createtypedlinkfacet': [
      'Facet.Attributes.*.DefaultValue.BinaryValue'
    ],
    'detachtypedlink': [
      'TypedLinkSpecifier.IdentityAttributeValues.*.Value.BinaryValue'
    ],
    'getlinkattributes': [
      'TypedLinkSpecifier.IdentityAttributeValues.*.Value.BinaryValue'
    ],
    'listincomingtypedlinks': [
      'FilterAttributeRanges.*.Range.EndValue.BinaryValue',
      'FilterAttributeRanges.*.Range.StartValue.BinaryValue'
    ],
    'listindex': [
      'RangesOnIndexedValues.*.Range.EndValue.BinaryValue',
      'RangesOnIndexedValues.*.Range.StartValue.BinaryValue'
    ],
    'listoutgoingtypedlinks': [
      'FilterAttributeRanges.*.Range.EndValue.BinaryValue',
      'FilterAttributeRanges.*.Range.StartValue.BinaryValue'
    ],
    'updatefacet': [
      'AttributeUpdates.*.Attribute.AttributeDefinition.DefaultValue.BinaryValue'
    ],
    'updatelinkattributes': [
      'AttributeUpdates.*.AttributeAction.AttributeUpdateValue.BinaryValue',
      'TypedLinkSpecifier.IdentityAttributeValues.*.Value.BinaryValue'
    ],
    'updateobjectattributes': [
      'AttributeUpdates.*.ObjectAttributeAction.ObjectAttributeUpdateValue.BinaryValue'
    ],
    'updatetypedlinkfacet': [
      'AttributeUpdates.*.Attribute.DefaultValue.BinaryValue'
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
  'dynamodb': {
    'batchexecutestatement': [
      'Statements.*.Parameters.*.B',
      'Statements.*.Parameters.*.BS.*'
    ],
    'batchgetitem': [
      'RequestItems.*.Keys.*.*.B',
      'RequestItems.*.Keys.*.*.BS.*'
    ],
    'batchwriteitem': [
      'RequestItems.*.*.DeleteRequest.Key.*.B',
      'RequestItems.*.*.DeleteRequest.Key.*.BS.*',
      'RequestItems.*.*.PutRequest.Item.*.B',
      'RequestItems.*.*.PutRequest.Item.*.BS.*'
    ],
    'deleteitem': [
      'Expected.*.AttributeValueList.*.B',
      'Expected.*.AttributeValueList.*.BS.*',
      'Expected.*.Value.B',
      'Expected.*.Value.BS.*',
      'ExpressionAttributeValues.*.B',
      'ExpressionAttributeValues.*.BS.*',
      'Key.*.B',
      'Key.*.BS.*'
    ],
    'executestatement': [
      'Parameters.*.B',
      'Parameters.*.BS.*'
    ],
    'executetransaction': [
      'TransactStatements.*.Parameters.*.B',
      'TransactStatements.*.Parameters.*.BS.*'
    ],
    'getitem': [
      'Key.*.B',
      'Key.*.BS.*'
    ],
    'putitem': [
      'Expected.*.AttributeValueList.*.B',
      'Expected.*.AttributeValueList.*.BS.*',
      'Expected.*.Value.B',
      'Expected.*.Value.BS.*',
      'ExpressionAttributeValues.*.B',
      'ExpressionAttributeValues.*.BS.*',
      'Item.*.B',
      'Item.*.BS.*'
    ],
    'query': [
      'ExclusiveStartKey.*.B',
      'ExclusiveStartKey.*.BS.*',
      'ExpressionAttributeValues.*.B',
      'ExpressionAttributeValues.*.BS.*',
      'KeyConditions.*.AttributeValueList.*.B',
      'KeyConditions.*.AttributeValueList.*.BS.*',
      'QueryFilter.*.AttributeValueList.*.B',
      'QueryFilter.*.AttributeValueList.*.BS.*'
    ],
    'scan': [
      'ExclusiveStartKey.*.B',
      'ExclusiveStartKey.*.BS.*',
      'ExpressionAttributeValues.*.B',
      'ExpressionAttributeValues.*.BS.*',
      'ScanFilter.*.AttributeValueList.*.B',
      'ScanFilter.*.AttributeValueList.*.BS.*'
    ],
    'transactgetitems': [
      'TransactItems.*.Get.Key.*.B',
      'TransactItems.*.Get.Key.*.BS.*'
    ],
    'transactwriteitems': [
      'TransactItems.*.ConditionCheck.ExpressionAttributeValues.*.B',
      'TransactItems.*.ConditionCheck.ExpressionAttributeValues.*.BS.*',
      'TransactItems.*.ConditionCheck.Key.*.B',
      'TransactItems.*.ConditionCheck.Key.*.BS.*',
      'TransactItems.*.Delete.ExpressionAttributeValues.*.B',
      'TransactItems.*.Delete.ExpressionAttributeValues.*.BS.*',
      'TransactItems.*.Delete.Key.*.B',
      'TransactItems.*.Delete.Key.*.BS.*',
      'TransactItems.*.Put.ExpressionAttributeValues.*.B',
      'TransactItems.*.Put.ExpressionAttributeValues.*.BS.*',
      'TransactItems.*.Put.Item.*.B',
      'TransactItems.*.Put.Item.*.BS.*',
      'TransactItems.*.Update.ExpressionAttributeValues.*.B',
      'TransactItems.*.Update.ExpressionAttributeValues.*.BS.*',
      'TransactItems.*.Update.Key.*.B',
      'TransactItems.*.Update.Key.*.BS.*'
    ],
    'updateitem': [
      'AttributeUpdates.*.Value.B',
      'AttributeUpdates.*.Value.BS.*',
      'Expected.*.AttributeValueList.*.B',
      'Expected.*.AttributeValueList.*.BS.*',
      'Expected.*.Value.B',
      'Expected.*.Value.BS.*',
      'ExpressionAttributeValues.*.B',
      'ExpressionAttributeValues.*.BS.*',
      'Key.*.B',
      'Key.*.BS.*'
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
  'frauddetector': {
    'geteventprediction': [
      'externalModelEndpointDataBlobs.*.byteBuffer'
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
      'ColumnStatisticsList.*.StatisticsData.DecimalColumnStatisticsData.MaximumValue.UnscaledValue',
      'ColumnStatisticsList.*.StatisticsData.DecimalColumnStatisticsData.MinimumValue.UnscaledValue'
    ],
    'updatecolumnstatisticsfortable': [
      'ColumnStatisticsList.*.StatisticsData.DecimalColumnStatisticsData.MaximumValue.UnscaledValue',
      'ColumnStatisticsList.*.StatisticsData.DecimalColumnStatisticsData.MinimumValue.UnscaledValue'
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
      'EncryptedKeyMaterial',
      'ImportToken'
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
    ],
    'startconversation': [
      'requestEventStream.AudioInputEvent.audioChunk'
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
  'medical-imaging': {
    'updateimagesetmetadata': [
      'updateImageSetMetadataUpdates.DICOMUpdates.removableAttributes',
      'updateImageSetMetadataUpdates.DICOMUpdates.updatableAttributes'
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
  'rds-data': {
    'batchexecutestatement': [
      'parameterSets.*.*.value.blobValue'
    ],
    'executestatement': [
      'parameters.*.value.blobValue'
    ]
  },
  'rekognition': {
    'comparefaces': [
      'SourceImage.Bytes',
      'TargetImage.Bytes'
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
    ],
    'startfacelivenesssession': [
      'LivenessRequestStream.VideoEvent.VideoChunk'
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
  'sns': {
    'publish': [
      'MessageAttributes.*.BinaryValue'
    ],
    'publishbatch': [
      'PublishBatchRequestEntries.*.MessageAttributes.*.BinaryValue'
    ]
  },
  'sqs': {
    'sendmessage': [
      'MessageAttributes.*.BinaryListValues.*',
      'MessageAttributes.*.BinaryValue',
      'MessageSystemAttributes.*.BinaryListValues.*',
      'MessageSystemAttributes.*.BinaryValue'
    ],
    'sendmessagebatch': [
      'Entries.*.MessageAttributes.*.BinaryListValues.*',
      'Entries.*.MessageAttributes.*.BinaryValue',
      'Entries.*.MessageSystemAttributes.*.BinaryListValues.*',
      'Entries.*.MessageSystemAttributes.*.BinaryValue'
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
  'transcribe': {
    'startcallanalyticsstreamtranscription': [
      'AudioStream.AudioEvent.AudioChunk'
    ],
    'startmedicalstreamtranscription': [
      'AudioStream.AudioEvent.AudioChunk'
    ],
    'startstreamtranscription': [
      'AudioStream.AudioEvent.AudioChunk'
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
      'DeviceTypeIos.Logo3x',
      'DeviceTypeLinux.Logo',
      'DeviceTypeOsx.Logo',
      'DeviceTypeWeb.Logo',
      'DeviceTypeWindows.Logo'
    ]
  }
};
