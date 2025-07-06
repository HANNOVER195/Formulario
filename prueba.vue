<script setup lang="ts">
import { db } from '~/firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'

async function fetchForms() {
  const querySnapshot = await getDocs(collection(db, 'formularios'))
  querySnapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data())
  })
}

fetchForms()
</script>
