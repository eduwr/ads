@app
ads-8d92

@http
/*
  method any
  src server

@static

@tables
user
  pk *String

password
  pk *String # userId

note
  pk *String  # userId
  sk **String # noteId

advertising
  pk *String  # userId
  sk **String # advertisingId