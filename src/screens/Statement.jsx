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

/////////////////////////////////////////////////////////////////////////////////////


  // Function to export sales report as an Excel file
  // import ExcelJS from "exceljs";
  // import RNFS from "react-native-fs";
  // import React, { useEffect, useState } from "react";
  // import firestore from "@react-native-firebase/firestore";
  // import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";

  // const Statement = () => {
  //   const [products, setProducts] = useState([]);
  //   const [reports, setReports] = useState([]);
  //   const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         // Fetch products data
  //         const productsSnapshot = await firestore().collection('datacolnew').get();
  //         const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  //         // Fetch suppliers data
  //         const suppliersSnapshot = await firestore().collection('suppliers').get();
  //         const suppliersData = suppliersSnapshot.docs.reduce((acc, doc) => {
  //           acc[doc.id] = doc.data(); // Map suppliers by ID
  //           return acc;
  //         }, {});

  //         // Combine products with their corresponding supplier details
  //         const enrichedProducts = productsData.map(product => ({
  //           ...product,
  //           supplierName: suppliersData[product.supplierId]?.name || 'Unknown',
  //         }));

  //         // Fetch sales reports data
  //         const salesSnapshot = await firestore().collection('salesReports').get();
  //         const salesReportsData = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  //         setProducts(enrichedProducts);
  //         setReports(salesReportsData);
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //         Alert.alert('Error', 'Failed to fetch data');
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchData();
  //   }, []);

  //   const exportProductsToExcel = async () => {
  //     try {
  //       const workbook = new ExcelJS.Workbook();
  //       const worksheet = workbook.addWorksheet("Products Report");

  //       worksheet.columns = [
  //         { header: "Product Name", key: "name", width: 20 },
  //         { header: "Product ID", key: "id", width: 20 },
  //         { header: "Supplier Name", key: "supplierName", width: 20 },
  //         { header: "Price", key: "price", width: 15 },
  //         { header: "Commission %", key: "commissionPercentage", width: 15 },
  //         { header: "Total Amount", key: "totalAmount", width: 20 },
  //       ];

  //       products.forEach(product => {
  //         worksheet.addRow({
  //           name: product.name,
  //           id: product.id,
  //           supplierName: product.supplierName,
  //           price: product.price,
  //           commissionPercentage: product.commissionPercentage || 0,
  //           totalAmount: product.price * (1 - (product.commissionPercentage / 100)),
  //         });
  //       });

  //       const buffer = await workbook.xlsx.writeBuffer();
  //       const base64 = buffer.toString("base64");
  //       const filePath = `${RNFS.DownloadDirectoryPath}/products_report.xlsx`;
  //       await RNFS.writeFile(filePath, base64, "base64");
  //       Alert.alert('Success', `Excel file has been saved to ${filePath}`);
  //     } catch (error) {
  //       console.error('Error generating Excel file:', error);
  //       Alert.alert('Error', 'Failed to generate Excel file');
  //     }
  //   };

  //   const exportSalesReportToExcel = async () => {
  //     try {
  //       const workbook = new ExcelJS.Workbook();
  //       const worksheet = workbook.addWorksheet("Sales Report");

  //       worksheet.columns = [
  //         { header: "Customer Name", key: "customerName", width: 20 },
  //         { header: "Customer Address", key: "customerAddress", width: 25 },
  //         { header: "Date", key: "date", width: 15 },
  //         { header: "Total Amount", key: "totalAmount", width: 15 },
  //         { header: "Products", key: "products", width: 50 }
  //       ];

  //       reports.forEach(report => {
  //         worksheet.addRow({
  //           customerName: report.customerName,
  //           customerAddress: report.customerAddress,
  //           date: new Date(report.date.seconds * 1000).toLocaleDateString(),
  //           totalAmount: report.totalAmount,
  //           products: report.products.map(product => `${product.name} (Qty: ${product.quantity}, Price: ${product.price})`).join(", ")
  //         });
  //       });

  //       const buffer = await workbook.xlsx.writeBuffer();
  //       const base64 = buffer.toString("base64");
  //       const filePath = `${RNFS.DownloadDirectoryPath}/sales_report.xlsx`;
  //       await RNFS.writeFile(filePath, base64, "base64");
  //       Alert.alert("Success", `Excel file has been saved to ${filePath}`);
  //     } catch (error) {
  //       console.error("Error generating Excel file:", error);
  //       Alert.alert("Error", "Failed to generate Excel file");
  //     }
  //   };

  //   if (loading) {
  //     return <ActivityIndicator size="large" color="#0000ff" />;
  //   }

  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.title}>Products Report</Text>
  //       <FlatList
  //         data={products}
  //         keyExtractor={(item) => item.id}
  //         renderItem={({ item }) => (
  //           <View style={styles.item}>
  //             <Text>Product Name: {item.name}</Text>
  //             <Text>Price: ₹{item.price}</Text>
  //             <Text>Supplier: {item.supplierName}</Text>
  //           </View>
  //         )}
  //       />
  //       <Button title="Export Products to Excel" onPress={exportProductsToExcel} />

  //       <Text style={styles.title}>Sales Report</Text>
  //       <FlatList
  //         data={reports}
  //         keyExtractor={(item) => item.id}
  //         renderItem={({ item }) => (
  //           <View style={styles.item}>
  //             <Text>Customer Name: {item.customerName}</Text>
  //             <Text>Address: {item.customerAddress}</Text>
  //             <Text>Date: {new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
  //             <Text>Total Amount: ₹{item.totalAmount}</Text>
  //             <Text>Products: {item.products.map(product => `${product.name} (Qty: ${product.quantity})`).join(", ")}</Text>
  //           </View>
  //         )}
  //       />
  //       <Button title="Export Sales Report to Excel" onPress={exportSalesReportToExcel} />
  //     </View>
  //   );
  // };

  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     padding: 16,
  //   },
  //   title: {
  //     fontSize: 24,
  //     fontWeight: 'bold',
  //     marginBottom: 16,
  //   },
  //   item: {
  //     padding: 16,
  //     borderBottomWidth: 1,
  //     borderBottomColor: "#ccc",
  //   },
  // });

  // export default Statement;

  /////////////////////////////////new code////////////////////////////////////
  import React, { useEffect, useState } from 'react';
  import ExcelJS from 'exceljs';
  import RNFS from 'react-native-fs';
  import firestore from '@react-native-firebase/firestore';
  import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';

  const Statement = () => {
    const [salesReports, setSalesReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch sales reports
          const reportsSnapshot = await firestore().collection('salesReports').get();
          const reportsData = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Fetch products and suppliers data
          const productsSnapshot = await firestore().collection('datacolnew').get();
          const productsData = {};
          productsSnapshot.docs.forEach(doc => {
            productsData[doc.id] = { id: doc.id, ...doc.data() };
          });

          const suppliersSnapshot = await firestore().collection('suppliers').get();
          const suppliersData = {};
          suppliersSnapshot.docs.forEach(doc => {
            suppliersData[doc.id] = doc.data();
          });

          // Combine sales reports with product and supplier details
          const enrichedReports = reportsData.map(report => {
            const products = report.products.map(product => {
              const productDetails = productsData[product.productId];
              const supplier = suppliersData[productDetails?.supplierId];

              return {
                ...product,
                name: productDetails?.name || 'Unknown',
                price: productDetails?.price || 0,
                quantity: product.quantity,
                supplierName: supplier?.name || 'Unknown',
                commissionPercentage: supplier?.commission || 0,
                total: (productDetails?.price || 0) * product.quantity,
              };
            });

            return {
              ...report,
              products,
            };
          });

          setSalesReports(enrichedReports);
        } catch (error) {
          console.error('Error fetching data:', error);
          Alert.alert('Error', 'Failed to fetch data');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    const exportToExcel = async () => {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');

        // Define columns
        worksheet.columns = [
          { header: 'Customer Name', key: 'customerName', width: 20 },
          { header: 'Customer Address', key: 'customerAddress', width: 25 },
          { header: 'Date', key: 'date', width: 25 },
          { header: 'Product Name', key: 'productName', width: 20 },
          { header: 'Price', key: 'price', width: 15 },
          { header: 'Quantity', key: 'quantity', width: 15 },
          { header: 'Total', key: 'total', width: 15 },
          { header: 'Supplier Name', key: 'supplierName', width: 20 },
          { header: 'Commission %', key: 'commissionPercentage', width: 15 },
        ];

        // Add rows to the worksheet
        salesReports.forEach(report => {
          report.products.forEach(product => {
            worksheet.addRow({
              customerName: report.customerName,
              customerAddress: report.customerAddress,
              date: report.createdAt ? report.createdAt.toString() : 'N/A', // Use the full createdAt field
              productName: product.name,
              price: product.price,
              quantity: product.quantity,
              total: product.total.toFixed(2),
              supplierName: product.supplierName,
              commissionPercentage: product.commissionPercentage,
            });
          });
        });

        // Generate Excel file and save it
        const buffer = await workbook.xlsx.writeBuffer();
        const base64 = buffer.toString('base64');

        // Save the Excel file to Downloads directory
        const filePath = `${RNFS.DownloadDirectoryPath}/sales_report.xlsx`;
        await RNFS.writeFile(filePath, base64, 'base64');

        Alert.alert('Success', `Excel file has been saved to ${filePath}`);
      } catch (error) {
        console.error('Error generating Excel file:', error);
        Alert.alert('Error', 'Failed to generate Excel file');
      }
    };

    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sales Report</Text>
        <FlatList
          data={salesReports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>Customer Name: {item.customerName}</Text>
              <Text>Address: {item.customerAddress}</Text>
              <Text>Date: {item.createdAt ? item.createdAt.toString() : 'N/A'}</Text>
              {item.products.map((product) => (
                <View key={product.productId} style={styles.productDetails}>
                  <Text>Product Name: {product.name}</Text>
                  <Text>Price: ₹{product.price.toFixed(2)}</Text>
                  <Text>Quantity: {product.quantity}</Text>
                  <Text>Total: ₹{product.total.toFixed(2)}</Text>
                  <Text>Supplier: {product.supplierName}</Text>
                  <Text>Commission: {product.commissionPercentage}%</Text>
                </View>
              ))}
            </View>
          )}
        />
        <Button title="Export to Excel" onPress={exportToExcel} />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    item: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    productDetails: {
      marginLeft: 20,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
  });

  export default Statement;
