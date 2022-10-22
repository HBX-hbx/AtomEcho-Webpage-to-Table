


function getSessionId(): string{
  // return "9NCcToWtip7blkwuI1VmgPGXFBQnD2v8"; // TODO: delete later
  let sessionId="sessionId=";
  let cookie:string[]=document.cookie.split(';');
  for(let i=0;i<cookie.length;i++){
    let c=cookie[i].trim();
    if(c.indexOf("sessionId")===0) return c.substring(sessionId.length,c.length);
  }
  return "";
}

export { getSessionId };
