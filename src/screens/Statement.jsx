// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import * as XLSX from 'xlsx';
// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';

// const DownloadReport = () => {
//   const [dataFetched, setDataFetched] = useState(false);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       let salesData = [];
//       let purchaseData = [];

//       // Fetch sales data
//       const salesSnapshot = await firestore().collection('salesReports').get();
//       salesSnapshot.forEach(doc => {
//         salesData.push({ id: doc.id, ...doc.data() });
//       });

//       // Fetch purchase data
//       const purchaseSnapshot = await firestore().collection('datacolnew').get();
//       purchaseSnapshot.forEach(doc => {
//         purchaseData.push({ id: doc.id, ...doc.data() });
//       });

//       // Combine the data (for example, you could merge by date)
//       const combinedData = salesData.map(sale => {
//         const purchase = purchaseData.find(pur => pur.date === sale.date);
//         return {
//           Date: sale.date,
//           Sales: sale.amount || 0,
//           Purchases: purchase ? purchase.amount : 0,
//           Profit: (sale.amount || 0) - (purchase ? purchase.amount : 0),
//         };
//       });

//       setData(combinedData);
//       setDataFetched(true);
//     };

//     fetchData();
//   }, []);

//   const generateExcel = async () => {
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report');

//     // Write the Excel file
//     const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

//     // Convert the binary string to array buffer
//     const buffer = new ArrayBuffer(wbout.length);
//     const view = new Uint8Array(buffer);
//     for (let i = 0; i !== wbout.length; ++i) view[i] = wbout.charCodeAt(i) & 0xFF;

//     const path = `${RNFS.DocumentDirectoryPath}/monthly_report.xlsx`;

//     // Write the file to the local filesystem
//     await RNFS.writeFile(path, buffer, 'base64')
//       .then(() => {
//         const shareOptions = {
//           title: 'Share file',
//           url: `file://${path}`,
//           type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         };

//         // Share the file
//         Share.open(shareOptions)
//           .then(res => console.log(res))
//           .catch(err => console.log(err));
//       })
//       .catch(err => console.log('Error writing file:', err));
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 18, marginBottom: 20 }}>Generate Monthly Report</Text>

//       {dataFetched && (
//         <TouchableOpacity
//           onPress={generateExcel}
//           style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5 }}>
//           <Text style={{ color: 'white' }}>Download Excel Report</Text>
//         </TouchableOpacity>
//       )}

//       {!dataFetched && <Text>Loading data...</Text>}
//     </View>
//   );
// };

// export default DownloadReport;
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';

const db = getFirestore();
const productsCollection = collection(db, 'datacolnew');
const suppliersCollection = collection(db, 'suppliers');
const salesReportCollection = collection(db, 'salesReports');

const Statement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsSnapshot = await getDocs(productsCollection);
        const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch suppliers
        const suppliersSnapshot = await getDocs(suppliersCollection);
        const suppliers = suppliersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch sales reports
        const salesSnapshot = await getDocs(salesReportCollection);
        const salesReports = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Combine data
        const combinedData = products.map(product => {
          const supplier = suppliers.find(s => s.id === product.supplierId) || {};
          const sale = salesReports.find(s => s.productId === product.id) || {};
          
          const commissionValue = (product.price * (supplier.commission || 0)) / 100; // Calculate commission as a percentage
          const profit = product.price - commissionValue; // Calculate profit

          return {
            productName: product.name,
            price: product.price,
            commission: commissionValue, // Store commission as calculated value
            profit: profit,
            dateOfPurchase: sale.dateOfPurchase || 'N/A',
            supplierName: supplier.name || 'Unknown'
          };
        });

        setData(combinedData);
      } catch (err) {
        console.error('Fetch Data Error:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Report</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.productName}</Text>
            <Text style={styles.cell}>₹{item.price.toFixed(2)}</Text>
            <Text style={styles.cell}>₹{item.commission.toFixed(2)}</Text>
            <Text style={styles.cell}>₹{item.profit.toFixed(2)}</Text>
            <Text style={styles.cell}>{item.dateOfPurchase}</Text>
            <Text style={styles.cell}>{item.supplierName}</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerText}>Product</Text>
            <Text style={styles.headerText}>Price</Text>
            <Text style={styles.headerText}>Commission</Text>
            <Text style={styles.headerText}>Profit</Text>
            <Text style={styles.headerText}>Date of Purchase</Text>
            <Text style={styles.headerText}>Supplier</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default Statement;
