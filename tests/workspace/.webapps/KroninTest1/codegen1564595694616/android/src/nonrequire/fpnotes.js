/*! KonyVisualizerV8420 2019-06-14 */

var iterationStartTime,platformName=kony.os.deviceInfo().name.toLowerCase(),isWindows=!1;"windows"!=platformName&&"windowsphone"!=platformName||(isWindows=!0);var __getAuthHeader__=function(t,n){var e=new KOAuth(null,null,notesDBURLs.consumerKey,notesDBURLs.consumerSecret,KOAuth._constants.VERSION_1_0,"",KOAuth._constants.SIGNATURE_SHA1),o=kony.ds.read("acc_token"),i=null,r=null;if(null!=o&&void 0!=o){i=o[0].oauth_access_token,r=o[0].oauth_access_token_secret;var a={},s=e._prepareParameters(i,r,t,n,null),c=e._buildAuthorizationHeaders(s);for(var d in a[KOAuth._constants.HTTP_AUTHORIZATION_HEADER]=c,e._headers)e._headers.hasOwnProperty(d)&&(a[d]=e._headers[d]);return kony.print("@@@@@@HEADER PARAMS: "+JSON.stringify(a)),a}},__updateNotesToRemoteDB__=function(t,n){var e,o=__getDSObjIdForAnnotation__(t),i={};kony.store.getItem(o)&&(i=kony.store.getItem(o));var r,a=0;for(e in t.callbackFP=n,t.annotationMapSize=Object.keys(i).length,i)r=i[e],iterationStartTime=new Date,processAnnotation(r,t,++a);0==Object.keys(i).length&&n({status:200})},__cloneObject__=function(t){if(null==t||"object"!=typeof t)return t;var n=t.constructor();for(var e in t)t.hasOwnProperty(e)&&(n[e]=t[e]);return n},processAnnotation=function(t,n,e){try{function o(o){kony.print(t.widgetId+" : Syncing annotation was completed!");var i=n.dsObjID;if(kony.print("SYNCED OR NOT FLAG IS : "+o),o&&(t.synced_on=iterationStartTime.getTime()),kony.store.getItem(i)&&Object.keys(kony.store.getItem(i)).length>0){var r=kony.store.getItem(i);null!=t&&(r[t.widgetId]=t)}kony.store.setItem(i,r),e!=n.annotationMapSize&&0!=n.annotationMapSize||(kony.print("DONE UPDATING COMMENTS TO DB"),n.callbackFP({status:200}))}n.dsObjID=__getDSObjIdForAnnotation__(n),t.id=t.widgetId,t.channel=n.channel,processNote(t,n,function(e,i){kony.print("In callback for notes1"),i?(kony.print("In callback for notes2"),t.noteGuid=i,processComments(t,n,o)):o(!1)})}catch(t){kony.print("Error occurred during syncing annotation. Error: "+t+"!")}},processNote=function(t,n,e){t.noteGuid&&delete t.noteGuid;var o=__cloneObject__(t);o.formId=o.widgetId=o.id,o.createdOn=(new Date).getTime(),o.modifiedOn=o.createdOn;var i=getNoteParam(o);kony.print("NOTE PARAM BEING SENT"+JSON.stringify(i));var r=notesDBURLs.prototypeBase+notesDBURLs.prototypeApi+"/accounts/"+n.acc_guid+"/project/"+n.proj_guid+"/notes";var a=__getAuthHeader__("POST",r);checkPlatformsForInvokeService(r,{method:"post",timeout:100},a,JSON.stringify(i),function(t,n){if(400==t){if(null==n||void 0==n)return;if(kony.print("MetaInfo resulttable FOR NOTES "+JSON.stringify(n)),"errmsg"in n)kony.print("Unable to reach host."),e(n.errmsg,null);else if("status"in n&&(kony.print("status : "+JSON.stringify(t)),200==n.status.code&&"result"in n)){var o=(isWindows?n.httpResponse.headers.Location:n.httpresponse.headers.Location).split("/"),i=o[o.length-1];e(null,i)}}},null)},findNewOrUpdatedComments=function(t,n){var e,o={};for(e in t){var i,r=t[e];for(i in r){var a=r[i];kony.print("validateComment(commentObj) : "+validateComment(a)),kony.print("annotation.synced_on"+n.synced_on),kony.print("new Date(commentObj.lastModifiedTime) :"+new Date(a.lastModifiedTime)),kony.print("new Date(annotation.synced_on) :"+new Date(n.synced_on)),validateComment(a)&&(!n.synced_on||new Date(a.lastModifiedTime)>new Date(n.synced_on))&&(o[i]=a)}}return kony.print("updates: "+JSON.stringify(o)),o},processComments=function(t,n,e){kony.print(n.dsObjID+">>"+t.widgetId,"Processing comments");var o=t.comments,i=findNewOrUpdatedComments(o,t),r=Object.keys(i);if(0==r.length)kony.print(n.dsObjID+">>"+t.widgetId,"No new comments found."),e(!0);else{var a=r.length,s=[];function c(t,n){var o;(a--,t&&(kony.print("PUSHING FAILED COMMENT"+t),s.push(t)),0==a)&&(o=!(s.length>0),e(o))}r.forEach(function(e){var o=i[e];saveNewComment(t,n,o,c)})}},saveNewComment=function(t,n,e,o){try{kony.print(n.dsObjID+">>"+t.widgetId,"Saving new comment.");e=getCommentParam(e);kony.print("NOTE GUID FOR COMMENT"+t.noteGuid);var i=notesDBURLs.prototypeBase+notesDBURLs.prototypeApi+"/accounts/"+n.acc_guid+"/project/"+n.proj_guid+"/notes/"+t.noteGuid+"/comment";var r=__getAuthHeader__("POST",i);checkPlatformsForInvokeService(i,{method:"post",timeout:100},r,JSON.stringify(e),function(t,n){if(400==t){if(null==n||void 0==n)return;kony.print("MetaInfo resulttable FOR COMMENTS "+JSON.stringify(n)),"errmsg"in n?(kony.print("Unable to reach host."),kony.print("FAILED TO PUSH THE COMMENT : "+e.comment),o(e.guid)):"status"in n&&200==n.status.code&&"result"in n&&(kony.print("PUSHED THE COMMENT SUCCESSFULLY : "+e.comment),o(null))}},null)}catch(t){o(e.guid)}},validateComment=function(t){return t.commentId&&t.createdOn&&t.createdById&&t.createdBy&&t.createdByEmail&&t.lastModifiedTime&&t.comment&&"Anonymous"!=t.createdBy},__fetchNotesFromRemoteDB__=function(t,n){var e,o,i=t.annotation_id,r=[],a=t.proj_guid+"_lastPullTime";function s(t,n){var e=(n=formatComment(n)).widgetId;t.comments[e]||(t.comments[e]={});var o=t.comments[e];return o[n.commentId]=n,t.synced_on=(new Date).getTime(),t.comments[e]=o,t}kony.store.getItem(a)&&kony.store.getItem(a).length>0&&(e=kony.store.getItem(a)[0].updated_since||1),kony.print("FETCHING PROJECT PARAMS"+JSON.stringify(t)),o=e?notesDBURLs.prototypeBase+notesDBURLs.prototypeApi+"/accounts/"+t.acc_guid+"/project/"+t.proj_guid+"/channel/"+t.channel+"/comments/"+e:notesDBURLs.prototypeBase+notesDBURLs.prototypeApi+"/accounts/"+t.acc_guid+"/project/"+t.proj_guid+"/channel/"+t.channel+"/comments/",kony.print("FETCHING COMMENTS");var c=__getAuthHeader__("GET",o);if(isWindows){var d=new Date(1970,1,1);c["if-modified-since"]=d.toUTCString()}kony.net.invokeServiceAsync(o,{httpconfig:{method:"get",timeout:100},httpheaders:c},function(o,c){var d=__cloneObject__(t),m=__getDSObjIdForAnnotation__(d),u={};if(kony.store.getItem(m)&&(u=kony.store.getItem(m)),400==o){if(null==c||void 0==c)return;if(kony.print("MetaInfo resulttable "+JSON.stringify(c)),"errmsg"in c)kony.print("Unable to reach host."),n({status:500,error:"Could not reach the host"});else if("status"in c&&200==c.status.code&&"result"in c){var l,p=c.result;for(l in p){var _=p[l];kony.print("New COMMENT "+JSON.stringify(_)),d.annotation_id=_.widget_id,d.channel=_.channel,r.push(new Date(_.db_sync_time).getTime()),null!=u[d.annotation_id]&&void 0!=u[d.annotation_id]?null!=(y=s(y=u[d.annotation_id],_))&&(u[d.annotation_id]=y):null!=(y=s({widgetId:d.annotation_id,active:1,comments:{}},_))&&(u[d.annotation_id]=y)}}}if(kony.store.setItem(m,u),r.length>0&&(e=Math.max.apply(Math,r),kony.print("updated_since TIME STAMP"+e)),kony.store.setItem(a,[{updated_since:e}]),t.annotation_id=i,null!==fpas.readAnnotationFromDataStore(t)){var y=fpas.readAnnotationFromDataStore(t);n({status:200,data:y})}else n({status:500,error:"Could not read annotation from Data store"})},null)},fpnotes={updateNotesToRemoteDB:__updateNotesToRemoteDB__,fetchNotesFromRemoteDB:__fetchNotesFromRemoteDB__},checkPlatformsForInvokeService=function(t,n,e,o,i,r){isWindows?(kony.print("Calling Windows network service"),kony.print("body : "+JSON.stringify(o)),kony.print("headers : "+JSON.stringify(e)),kony.net.invokeServiceAsync2(t,{httpconfig:n,httpheaders:e,json:o},i,r)):(kony.print("Calling Non-windows network service"),kony.net.invokeServiceAsync(t,{httpconfig:n,httpheaders:e,json:o},i,r))};