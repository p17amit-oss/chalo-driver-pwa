export default function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.status(200).json({publicKey:process.env.VAPID_PUBLIC_KEY||''});
}
