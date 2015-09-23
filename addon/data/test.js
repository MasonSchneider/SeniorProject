
console.log("E::LO");

const nsIX509CertDB = Ci.nsIX509CertDB;
const nsX509CertDB = "@mozilla.org/security/x509certdb;1";
const nsIX509Cert = Ci.nsIX509Cert;

const nsIFilePicker = Ci.nsIFilePicker;
const nsFilePicker = "@mozilla.org/filepicker;1";
const gCertFileTypes = "*.p7b; *.crt; *.cert; *.cer; *.pem; *.der";


if ("undefined" == typeof(CertManager)) {
  var CertManager = {};

  CertManager.isBuiltinToken = function(tokenName) {
    return tokenName == "Builtin Object Token"; 
  }
  
  CertManager.isCertBuiltIn = function(cert) {
    var tokenNames = cert.getAllTokenNames({});
    if (!tokenNames) {
      return false;
    }
    if (tokenNames.some(CertManager.isBuiltinToken)) {
      return true;
    }
    return false;
  }
  
  CertManager.isTrusted = function(cert) {
    var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
    var sslTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_SSL); 
    var emailTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_EMAIL); 
    var objTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_OBJSIGN);
    return sslTrust || emailTrust || objTrust;
  }
  
  CertManager.genCAData = function() {
  
    var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
    var certcache = certdb.getCerts();
    var enumerator = certcache.getEnumerator();
    var authorities = {};
  
    while (enumerator.hasMoreElements()) {
    	var cert =
    	enumerator.getNext().QueryInterface(Ci.nsIX509Cert);
    	if (cert.certType == nsIX509Cert.CA_CERT) {
			console.log("cer");
    	}
    }
  }  
  
  CertManager.addCACerts = function() {
      var fp = Cc[nsFilePicker].createInstance(nsIFilePicker);
      fp.init(window,
              "Select File containing CA certificate(s) to import",
              nsIFilePicker.modeOpen);
      fp.appendFilter("Certificate Files",
                      gCertFileTypes);
      fp.appendFilters(nsIFilePicker.filterAll);
      if (fp.show() == nsIFilePicker.returnOK) {
        var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
        certdb.importCertsFromFile(null, fp.file, nsIX509Cert.CA_CERT);
        CertManager.setView();
      }
    }
};