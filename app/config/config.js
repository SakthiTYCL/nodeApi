//connection string for the database
module.exports = {
    // ConnectionString: "mysql://adminwQ6MUP1:iTzEgJKEURiH@127.3.118.2:3306/nkanaapi",
//    ConnectionString: "mysql://tycl:123456789@tycl.c5kszsv267nx.us-east-2.rds.amazonaws.com:3306/nkanaapi",
    // ConnectionString: "mysql://tyclorgi_nkana:nkana!@#$@tycl.org.in:3306/tyclorgi_nkanaapi",
    // ConnectionString: "mysql://adminwQ6MUP1:iTzEgJKEURiH@127.0.0.1:3306/nkanaapi",    
    ConnectionString: "mysql://root@localhost/nkanaapi",   
    settings: {
        define: {
            timestamps: false
        }
    }
}