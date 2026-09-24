import webpush from 'web-push';

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const {subscription,title='Chalo Driver',body='Test notification',url='/'}=req.body||{};
  if(!subscription)return res.status(400).json({error:'Missing push subscription'});
  const publicKey=process.env.VAPID_PUBLIC_KEY;
  const privateKey=process.env.VAPID_PRIVATE_KEY;
  const subject=process.env.VAPID_SUBJECT||'mailto:admin@chalo.com';
  if(!publicKey||!privateKey)return res.status(500).json({error:'VAPID keys are not configured'});
  try{
    webpush.setVapidDetails(subject,publicKey,privateKey);
    await webpush.sendNotification(subscription,JSON.stringify({title,body,url}));
    return res.status(200).json({ok:true});
  }catch(err){
    console.error(err);
    return res.status(err.statusCode||500).json({error:err.body||err.message||'Push failed'});
  }
}
